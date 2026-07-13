'use client'

import { useAuth, useDocumentInfo } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'
import './AdminChat.css'

export const AdminChatView: React.FC = () => {
  const { user } = useAuth()
  const { id: ticketId } = useDocumentInfo()

  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [attachments, setAttachments] = useState<{ file: File; previewUrl: string; mediaId?: number; uploading: boolean }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMessages = async () => {
    if (!ticketId) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`/api/support-messages?where[ticket][equals]=${ticketId}&sort=createdAt&depth=1`)
      const data = await res.json()
      setMessages(data.docs || [])
    } catch (err) {
      console.error('Failed to fetch messages', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newAttachments = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
    }))

    setAttachments((prev) => [...prev, ...newAttachments])

    // Upload each file
    for (const att of newAttachments) {
      try {
        const formData = new FormData()
        formData.append('file', att.file)

        const res = await fetch('/api/support/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()

        setAttachments((prev) =>
          prev.map((p) => (p.previewUrl === att.previewUrl ? { ...p, mediaId: data.doc.id, uploading: false } : p)),
        )
      } catch (err) {
        console.error('Failed to upload attachment', err)
        setAttachments((prev) => prev.filter((p) => p.previewUrl !== att.previewUrl))
        alert('Failed to upload image. Max size is 2MB.')
      }
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (previewUrl: string) => {
    setAttachments((prev) => prev.filter((p) => p.previewUrl !== previewUrl))
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending || !ticketId || !user) return
    if (!reply.trim() && !attachments.some((a) => a.mediaId)) return
    if (attachments.some((a) => a.uploading)) return

    setSending(true)
    try {
      const attachmentIds = attachments.map((a) => a.mediaId).filter(Boolean)
      
      const res = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket: ticketId,
          sender: user.id,
          senderRole: 'admin',
          message: reply.trim() || ' ', // Payload might require message, so send space if only attachment
          ...(attachmentIds.length > 0 ? { attachments: attachmentIds.map(id => ({ file: id })) } : {}),
        }),
      })
      if (res.ok) {
        setReply('')
        setAttachments([])
        await fetchMessages()
        
        // Update ticket status to waiting_customer
        await fetch(`/api/support-tickets/${ticketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'waiting_customer',
          }),
        }).catch(console.error)
      }
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSending(false)
    }
  }

  if (!ticketId) {
    return <div className="admin-chat-container"><div className="admin-chat-empty">Please save the ticket first.</div></div>
  }

  return (
    <div className="admin-chat-container" style={{ marginTop: 0, border: 'none', borderRadius: 0 }}>
      <div className="admin-chat-messages" style={{ height: 'calc(100vh - 300px)', maxHeight: 'none' }}>
        {loading ? (
          <div className="admin-chat-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="admin-chat-empty">No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'support'
            const senderName = typeof msg.sender === 'object' ? (msg.sender?.name || msg.sender?.email) : 'Unknown'
            
            return (
              <div key={msg.id} className={`admin-chat-message-wrapper ${isAdmin ? 'admin-chat-right' : 'admin-chat-left'}`}>
                <div className={`admin-chat-bubble ${isAdmin ? 'admin-chat-bubble-admin' : 'admin-chat-bubble-customer'}`}>
                  <div className="admin-chat-text">{msg.message}</div>
                  
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="admin-chat-attachments">
                      {msg.attachments.map((att: any, i: number) => {
                        const media = att.file
                        if (!media || typeof media !== 'object') return null
                        return (
                          <a key={i} href={media.url} target="_blank" rel="noopener noreferrer" className="admin-chat-attachment-link">
                            <img src={media.url} alt={media.alt || 'attachment'} className="admin-chat-attachment-img" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className="admin-chat-meta">
                  {isAdmin ? 'You' : senderName} • {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="admin-chat-form">
        {attachments.length > 0 && (
          <div className="admin-chat-preview-container">
            {attachments.map((att) => (
              <div key={att.previewUrl} className="admin-chat-preview-item">
                <img src={att.previewUrl} alt="preview" className="admin-chat-preview-img" />
                {att.uploading && <div className="admin-chat-preview-loading">⏳</div>}
                <button
                  type="button"
                  onClick={() => removeAttachment(att.previewUrl)}
                  className="admin-chat-preview-remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="admin-chat-input-row">
          <button 
            type="button" 
            className="admin-chat-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image"
          >
            📎
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/jpeg,image/png,image/gif,image/webp" 
            multiple 
            style={{ display: 'none' }} 
          />
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e as any)
              }
            }}
            placeholder="Type your reply... (Enter to send)"
            className="admin-chat-input"
            rows={2}
          />
          <button 
            type="submit" 
            disabled={sending || attachments.some(a => a.uploading) || (!reply.trim() && !attachments.some(a => a.mediaId))} 
            className="admin-chat-submit"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
