--
-- PostgreSQL database dump
--

\restrict 0kp2XKzIhVej66QbO6ceeJEAurMgn7ci7mCAdJ2IkaVkN2K6ShufCeqnrEXxbqE

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum__pages_v_blocks_archive_populate_by; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_archive_populate_by AS ENUM (
    'collection',
    'selection'
);


--
-- Name: enum__pages_v_blocks_archive_relation_to; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_archive_relation_to AS ENUM (
    'products'
);


--
-- Name: enum__pages_v_blocks_banner_style; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_banner_style AS ENUM (
    'info',
    'warning',
    'error',
    'success'
);


--
-- Name: enum__pages_v_blocks_carousel_populate_by; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_carousel_populate_by AS ENUM (
    'collection',
    'selection'
);


--
-- Name: enum__pages_v_blocks_carousel_relation_to; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_carousel_relation_to AS ENUM (
    'products'
);


--
-- Name: enum__pages_v_blocks_content_columns_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_content_columns_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum__pages_v_blocks_content_columns_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_content_columns_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum__pages_v_blocks_content_columns_size; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_content_columns_size AS ENUM (
    'oneThird',
    'half',
    'twoThirds',
    'full'
);


--
-- Name: enum__pages_v_blocks_cta_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_cta_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum__pages_v_blocks_cta_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_blocks_cta_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum__pages_v_version_hero_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_version_hero_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum__pages_v_version_hero_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_version_hero_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum__pages_v_version_hero_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_version_hero_type AS ENUM (
    'none',
    'highImpact',
    'mediumImpact',
    'lowImpact',
    'flashSale'
);


--
-- Name: enum__pages_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__pages_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__products_v_blocks_content_columns_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_blocks_content_columns_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum__products_v_blocks_content_columns_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_blocks_content_columns_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum__products_v_blocks_content_columns_size; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_blocks_content_columns_size AS ENUM (
    'oneThird',
    'half',
    'twoThirds',
    'full'
);


--
-- Name: enum__products_v_blocks_cta_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_blocks_cta_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum__products_v_blocks_cta_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_blocks_cta_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum__products_v_version_badge; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_version_badge AS ENUM (
    'new',
    'best_seller',
    'discount'
);


--
-- Name: enum__products_v_version_digital_fulfillment_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_version_digital_fulfillment_mode AS ENUM (
    'standard',
    'per_unit_stock'
);


--
-- Name: enum__products_v_version_license_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_version_license_type AS ENUM (
    'standard',
    'extended',
    'personal',
    'commercial',
    'unlimited'
);


--
-- Name: enum__products_v_version_product_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_version_product_type AS ENUM (
    'digital',
    'license_key',
    'ebook',
    'template',
    'source_code',
    'ui_kit',
    'prompt_pack'
);


--
-- Name: enum__products_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__products_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__variants_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__variants_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_addresses_country; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_addresses_country AS ENUM (
    'US',
    'GB',
    'CA',
    'AU',
    'AT',
    'BE',
    'BR',
    'BG',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HK',
    'HU',
    'IN',
    'IE',
    'IT',
    'JP',
    'LV',
    'LT',
    'LU',
    'MY',
    'MT',
    'MX',
    'NL',
    'NZ',
    'NO',
    'PL',
    'PT',
    'RO',
    'SG',
    'SK',
    'SI',
    'ES',
    'SE',
    'CH'
);


--
-- Name: enum_carts_currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_carts_currency AS ENUM (
    'IDR',
    'USD'
);


--
-- Name: enum_checkout_sessions_currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_checkout_sessions_currency AS ENUM (
    'IDR',
    'USD'
);


--
-- Name: enum_checkout_sessions_payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_checkout_sessions_payment_method AS ENUM (
    'pakasir',
    'nowpayments'
);


--
-- Name: enum_checkout_sessions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_checkout_sessions_status AS ENUM (
    'creating',
    'pending',
    'completed',
    'cancelled',
    'expired'
);


--
-- Name: enum_coupons_allowed_tiers; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_coupons_allowed_tiers AS ENUM (
    'bronze',
    'silver',
    'gold',
    'diamond'
);


--
-- Name: enum_coupons_code_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_coupons_code_mode AS ENUM (
    'manual',
    'auto'
);


--
-- Name: enum_coupons_discount_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_coupons_discount_type AS ENUM (
    'percentage',
    'fixed'
);


--
-- Name: enum_coupons_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_coupons_status AS ENUM (
    'active',
    'inactive',
    'expired'
);


--
-- Name: enum_digital_assets_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_digital_assets_status AS ENUM (
    'active',
    'draft',
    'archived'
);


--
-- Name: enum_digital_stock_units_delivery_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_digital_stock_units_delivery_type AS ENUM (
    'credentials',
    'file',
    'text'
);


--
-- Name: enum_digital_stock_units_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_digital_stock_units_status AS ENUM (
    'available',
    'reserved',
    'assigned',
    'archived'
);


--
-- Name: enum_download_access_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_download_access_status AS ENUM (
    'active',
    'expired',
    'revoked'
);


--
-- Name: enum_email_templates_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_email_templates_status AS ENUM (
    'active',
    'inactive'
);


--
-- Name: enum_email_templates_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_email_templates_type AS ENUM (
    'welcome',
    'order_paid',
    'payment_pending',
    'download_ready',
    'license_created',
    'support_reply',
    'password_reset'
);


--
-- Name: enum_footer_nav_items_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_footer_nav_items_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_forms_confirmation_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_forms_confirmation_type AS ENUM (
    'message',
    'redirect'
);


--
-- Name: enum_header_nav_items_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_header_nav_items_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_licenses_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_licenses_status AS ENUM (
    'active',
    'inactive',
    'expired',
    'revoked'
);


--
-- Name: enum_orders_currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_orders_currency AS ENUM (
    'IDR',
    'USD'
);


--
-- Name: enum_orders_digital_deliveries_units_delivery_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_orders_digital_deliveries_units_delivery_type AS ENUM (
    'credentials',
    'file',
    'text'
);


--
-- Name: enum_orders_member_tier_snapshot; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_orders_member_tier_snapshot AS ENUM (
    'bronze',
    'silver',
    'gold',
    'diamond'
);


--
-- Name: enum_orders_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_orders_status AS ENUM (
    'processing',
    'completed',
    'cancelled',
    'refunded'
);


--
-- Name: enum_pages_blocks_archive_populate_by; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_archive_populate_by AS ENUM (
    'collection',
    'selection'
);


--
-- Name: enum_pages_blocks_archive_relation_to; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_archive_relation_to AS ENUM (
    'products'
);


--
-- Name: enum_pages_blocks_banner_style; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_banner_style AS ENUM (
    'info',
    'warning',
    'error',
    'success'
);


--
-- Name: enum_pages_blocks_carousel_populate_by; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_carousel_populate_by AS ENUM (
    'collection',
    'selection'
);


--
-- Name: enum_pages_blocks_carousel_relation_to; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_carousel_relation_to AS ENUM (
    'products'
);


--
-- Name: enum_pages_blocks_content_columns_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_content_columns_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum_pages_blocks_content_columns_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_content_columns_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_pages_blocks_content_columns_size; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_content_columns_size AS ENUM (
    'oneThird',
    'half',
    'twoThirds',
    'full'
);


--
-- Name: enum_pages_blocks_cta_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_cta_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum_pages_blocks_cta_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_blocks_cta_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_pages_hero_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_hero_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum_pages_hero_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_hero_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_pages_hero_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_hero_type AS ENUM (
    'none',
    'highImpact',
    'mediumImpact',
    'lowImpact',
    'flashSale'
);


--
-- Name: enum_pages_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_pages_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_payment_transactions_provider; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_payment_transactions_provider AS ENUM (
    'stripe',
    'midtrans',
    'xendit',
    'manual',
    'dummy'
);


--
-- Name: enum_payment_transactions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_payment_transactions_status AS ENUM (
    'created',
    'waiting_payment',
    'settlement',
    'capture',
    'deny',
    'cancel',
    'expire',
    'refund'
);


--
-- Name: enum_products_badge; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_badge AS ENUM (
    'new',
    'best_seller',
    'discount'
);


--
-- Name: enum_products_blocks_content_columns_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_blocks_content_columns_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum_products_blocks_content_columns_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_blocks_content_columns_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_products_blocks_content_columns_size; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_blocks_content_columns_size AS ENUM (
    'oneThird',
    'half',
    'twoThirds',
    'full'
);


--
-- Name: enum_products_blocks_cta_links_link_appearance; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_blocks_cta_links_link_appearance AS ENUM (
    'default',
    'outline'
);


--
-- Name: enum_products_blocks_cta_links_link_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_blocks_cta_links_link_type AS ENUM (
    'reference',
    'custom'
);


--
-- Name: enum_products_digital_fulfillment_mode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_digital_fulfillment_mode AS ENUM (
    'standard',
    'per_unit_stock'
);


--
-- Name: enum_products_license_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_license_type AS ENUM (
    'standard',
    'extended',
    'personal',
    'commercial',
    'unlimited'
);


--
-- Name: enum_products_product_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_product_type AS ENUM (
    'digital',
    'license_key',
    'ebook',
    'template',
    'source_code',
    'ui_kit',
    'prompt_pack'
);


--
-- Name: enum_products_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_promo_banners_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_promo_banners_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_stock_ledger_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_stock_ledger_type AS ENUM (
    'in',
    'out',
    'reserved',
    'released',
    'adjust'
);


--
-- Name: enum_stock_reservations_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_stock_reservations_status AS ENUM (
    'pending',
    'confirmed',
    'released'
);


--
-- Name: enum_support_messages_sender_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_support_messages_sender_role AS ENUM (
    'customer',
    'admin',
    'support'
);


--
-- Name: enum_support_tickets_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_support_tickets_category AS ENUM (
    'payment_issue',
    'download_problem',
    'license_key_problem',
    'product_access_problem',
    'refund_request',
    'technical_support',
    'general_question'
);


--
-- Name: enum_support_tickets_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_support_tickets_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


--
-- Name: enum_support_tickets_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_support_tickets_status AS ENUM (
    'open',
    'waiting_customer',
    'in_progress',
    'resolved',
    'closed'
);


--
-- Name: enum_testimonials_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_testimonials_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_transactions_currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_transactions_currency AS ENUM (
    'IDR',
    'USD'
);


--
-- Name: enum_transactions_payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_transactions_payment_method AS ENUM (
    'pakasir',
    'nowpayments'
);


--
-- Name: enum_transactions_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_transactions_status AS ENUM (
    'pending',
    'succeeded',
    'failed',
    'cancelled',
    'expired',
    'refunded'
);


--
-- Name: enum_users_member_tier; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_member_tier AS ENUM (
    'bronze',
    'silver',
    'gold',
    'diamond'
);


--
-- Name: enum_users_roles; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_roles AS ENUM (
    'admin',
    'manager',
    'finance',
    'support',
    'customer'
);


--
-- Name: enum_users_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_status AS ENUM (
    'active',
    'inactive',
    'blocked'
);


--
-- Name: enum_variants_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_variants_status AS ENUM (
    'draft',
    'published'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _pages_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_published_on timestamp(3) with time zone,
    version_hero_type public.enum__pages_v_version_hero_type DEFAULT 'flashSale'::public.enum__pages_v_version_hero_type,
    version_hero_rich_text jsonb,
    version_hero_media_id integer,
    version_meta_title character varying,
    version_meta_image_id integer,
    version_meta_description character varying,
    version_generate_slug boolean DEFAULT true,
    version_slug character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__pages_v_version_status DEFAULT 'draft'::public.enum__pages_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean
);


--
-- Name: _pages_v_blocks_archive; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_archive (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    intro_content jsonb,
    populate_by public.enum__pages_v_blocks_archive_populate_by DEFAULT 'collection'::public.enum__pages_v_blocks_archive_populate_by,
    relation_to public.enum__pages_v_blocks_archive_relation_to DEFAULT 'products'::public.enum__pages_v_blocks_archive_relation_to,
    "limit" numeric DEFAULT 10,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_archive_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_archive_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_archive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_archive_id_seq OWNED BY public._pages_v_blocks_archive.id;


--
-- Name: _pages_v_blocks_banner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    style public.enum__pages_v_blocks_banner_style DEFAULT 'info'::public.enum__pages_v_blocks_banner_style,
    content jsonb,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_banner_id_seq OWNED BY public._pages_v_blocks_banner.id;


--
-- Name: _pages_v_blocks_carousel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_carousel (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    populate_by public.enum__pages_v_blocks_carousel_populate_by DEFAULT 'collection'::public.enum__pages_v_blocks_carousel_populate_by,
    relation_to public.enum__pages_v_blocks_carousel_relation_to DEFAULT 'products'::public.enum__pages_v_blocks_carousel_relation_to,
    "limit" numeric DEFAULT 10,
    populated_docs_total numeric,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_carousel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_carousel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_carousel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_carousel_id_seq OWNED BY public._pages_v_blocks_carousel.id;


--
-- Name: _pages_v_blocks_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_content_columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_content_columns (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    size public.enum__pages_v_blocks_content_columns_size DEFAULT 'oneThird'::public.enum__pages_v_blocks_content_columns_size,
    rich_text jsonb,
    enable_link boolean,
    link_type public.enum__pages_v_blocks_content_columns_link_type DEFAULT 'reference'::public.enum__pages_v_blocks_content_columns_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum__pages_v_blocks_content_columns_link_appearance DEFAULT 'default'::public.enum__pages_v_blocks_content_columns_link_appearance,
    _uuid character varying
);


--
-- Name: _pages_v_blocks_content_columns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_content_columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_content_columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_content_columns_id_seq OWNED BY public._pages_v_blocks_content_columns.id;


--
-- Name: _pages_v_blocks_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_content_id_seq OWNED BY public._pages_v_blocks_content.id;


--
-- Name: _pages_v_blocks_cta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_cta (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    rich_text jsonb,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_cta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_cta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_cta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_cta_id_seq OWNED BY public._pages_v_blocks_cta.id;


--
-- Name: _pages_v_blocks_cta_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_cta_links (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    link_type public.enum__pages_v_blocks_cta_links_link_type DEFAULT 'reference'::public.enum__pages_v_blocks_cta_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum__pages_v_blocks_cta_links_link_appearance DEFAULT 'default'::public.enum__pages_v_blocks_cta_links_link_appearance,
    _uuid character varying
);


--
-- Name: _pages_v_blocks_cta_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_cta_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_cta_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_cta_links_id_seq OWNED BY public._pages_v_blocks_cta_links.id;


--
-- Name: _pages_v_blocks_form_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_form_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    form_id integer,
    enable_intro boolean,
    intro_content jsonb,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_form_block_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_form_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_form_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_form_block_id_seq OWNED BY public._pages_v_blocks_form_block.id;


--
-- Name: _pages_v_blocks_media_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_media_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    media_id integer,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_media_block_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_media_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_media_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_media_block_id_seq OWNED BY public._pages_v_blocks_media_block.id;


--
-- Name: _pages_v_blocks_three_item_grid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_blocks_three_item_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _pages_v_blocks_three_item_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_blocks_three_item_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_blocks_three_item_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_blocks_three_item_grid_id_seq OWNED BY public._pages_v_blocks_three_item_grid.id;


--
-- Name: _pages_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_id_seq OWNED BY public._pages_v.id;


--
-- Name: _pages_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer,
    categories_id integer,
    products_id integer
);


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_rels_id_seq OWNED BY public._pages_v_rels.id;


--
-- Name: _pages_v_version_hero_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._pages_v_version_hero_links (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    link_type public.enum__pages_v_version_hero_links_link_type DEFAULT 'reference'::public.enum__pages_v_version_hero_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum__pages_v_version_hero_links_link_appearance DEFAULT 'default'::public.enum__pages_v_version_hero_links_link_appearance,
    _uuid character varying
);


--
-- Name: _pages_v_version_hero_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._pages_v_version_hero_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _pages_v_version_hero_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._pages_v_version_hero_links_id_seq OWNED BY public._pages_v_version_hero_links.id;


--
-- Name: _products_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_description jsonb,
    version_inventory numeric DEFAULT 0,
    version_enable_variants boolean,
    version_price_in_u_s_d_enabled boolean,
    version_price_in_u_s_d numeric,
    version_meta_title character varying,
    version_meta_image_id integer,
    version_meta_description character varying,
    version_generate_slug boolean DEFAULT true,
    version_slug character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version_deleted_at timestamp(3) with time zone,
    version__status public.enum__products_v_version_status DEFAULT 'draft'::public.enum__products_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean,
    version_short_description character varying,
    version_product_type public.enum__products_v_version_product_type DEFAULT 'digital'::public.enum__products_v_version_product_type,
    version_license_type public.enum__products_v_version_license_type DEFAULT 'standard'::public.enum__products_v_version_license_type,
    version_version character varying DEFAULT '1.0.0'::character varying,
    version_update_policy character varying,
    version_refund_policy character varying,
    version_is_featured boolean DEFAULT false,
    version_badge public.enum__products_v_version_badge,
    version_price_in_i_d_r_enabled boolean,
    version_price_in_i_d_r numeric,
    version_promo_is_flash_sale boolean DEFAULT false,
    version_promo_flash_sale_end_date timestamp(3) with time zone,
    version_promo_discount_percent numeric,
    version_digital_fulfillment_mode public.enum__products_v_version_digital_fulfillment_mode DEFAULT 'standard'::public.enum__products_v_version_digital_fulfillment_mode
);


--
-- Name: _products_v_blocks_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_blocks_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _products_v_blocks_content_columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_blocks_content_columns (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    size public.enum__products_v_blocks_content_columns_size DEFAULT 'oneThird'::public.enum__products_v_blocks_content_columns_size,
    rich_text jsonb,
    enable_link boolean,
    link_type public.enum__products_v_blocks_content_columns_link_type DEFAULT 'reference'::public.enum__products_v_blocks_content_columns_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum__products_v_blocks_content_columns_link_appearance DEFAULT 'default'::public.enum__products_v_blocks_content_columns_link_appearance,
    _uuid character varying
);


--
-- Name: _products_v_blocks_content_columns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_blocks_content_columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_blocks_content_columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_blocks_content_columns_id_seq OWNED BY public._products_v_blocks_content_columns.id;


--
-- Name: _products_v_blocks_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_blocks_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_blocks_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_blocks_content_id_seq OWNED BY public._products_v_blocks_content.id;


--
-- Name: _products_v_blocks_cta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_blocks_cta (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    rich_text jsonb,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _products_v_blocks_cta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_blocks_cta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_blocks_cta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_blocks_cta_id_seq OWNED BY public._products_v_blocks_cta.id;


--
-- Name: _products_v_blocks_cta_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_blocks_cta_links (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    link_type public.enum__products_v_blocks_cta_links_link_type DEFAULT 'reference'::public.enum__products_v_blocks_cta_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum__products_v_blocks_cta_links_link_appearance DEFAULT 'default'::public.enum__products_v_blocks_cta_links_link_appearance,
    _uuid character varying
);


--
-- Name: _products_v_blocks_cta_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_blocks_cta_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_blocks_cta_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_blocks_cta_links_id_seq OWNED BY public._products_v_blocks_cta_links.id;


--
-- Name: _products_v_blocks_media_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_blocks_media_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    media_id integer,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _products_v_blocks_media_block_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_blocks_media_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_blocks_media_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_blocks_media_block_id_seq OWNED BY public._products_v_blocks_media_block.id;


--
-- Name: _products_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_id_seq OWNED BY public._products_v.id;


--
-- Name: _products_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer,
    variant_types_id integer,
    products_id integer,
    categories_id integer
);


--
-- Name: _products_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_rels_id_seq OWNED BY public._products_v_rels.id;


--
-- Name: _products_v_version_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_version_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    variant_option_id integer,
    _uuid character varying
);


--
-- Name: _products_v_version_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_version_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_version_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_version_gallery_id_seq OWNED BY public._products_v_version_gallery.id;


--
-- Name: _products_v_version_included_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_version_included_files (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    format character varying,
    size character varying,
    _uuid character varying
);


--
-- Name: _products_v_version_included_files_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_version_included_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_version_included_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_version_included_files_id_seq OWNED BY public._products_v_version_included_files.id;


--
-- Name: _products_v_version_product_f_a_q; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._products_v_version_product_f_a_q (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer character varying,
    _uuid character varying
);


--
-- Name: _products_v_version_product_f_a_q_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._products_v_version_product_f_a_q_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _products_v_version_product_f_a_q_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._products_v_version_product_f_a_q_id_seq OWNED BY public._products_v_version_product_f_a_q.id;


--
-- Name: _variants_v; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._variants_v (
    id integer NOT NULL,
    parent_id integer,
    version_title character varying,
    version_product_id integer,
    version_inventory numeric DEFAULT 0,
    version_price_in_u_s_d_enabled boolean,
    version_price_in_u_s_d numeric,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version_deleted_at timestamp(3) with time zone,
    version__status public.enum__variants_v_version_status DEFAULT 'draft'::public.enum__variants_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean,
    version_price_in_i_d_r_enabled boolean,
    version_price_in_i_d_r numeric
);


--
-- Name: _variants_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._variants_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _variants_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._variants_v_id_seq OWNED BY public._variants_v.id;


--
-- Name: _variants_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._variants_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    variant_options_id integer
);


--
-- Name: _variants_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._variants_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _variants_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._variants_v_rels_id_seq OWNED BY public._variants_v_rels.id;


--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    customer_id integer,
    title character varying,
    first_name character varying,
    last_name character varying,
    company character varying,
    address_line1 character varying,
    address_line2 character varying,
    city character varying,
    state character varying,
    postal_code character varying,
    country public.enum_addresses_country NOT NULL,
    phone character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    secret character varying,
    customer_id integer,
    purchased_at timestamp(3) with time zone,
    subtotal numeric,
    currency public.enum_carts_currency DEFAULT 'IDR'::public.enum_carts_currency,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: carts_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    product_id integer,
    variant_id integer,
    quantity numeric DEFAULT 1 NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying NOT NULL,
    generate_slug boolean DEFAULT true,
    slug character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: checkout_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checkout_sessions (
    id integer NOT NULL,
    session_id character varying NOT NULL,
    customer_id integer NOT NULL,
    status public.enum_checkout_sessions_status DEFAULT 'creating'::public.enum_checkout_sessions_status NOT NULL,
    expires_at timestamp(3) with time zone NOT NULL,
    reservation_id character varying,
    cart_id character varying,
    currency public.enum_checkout_sessions_currency NOT NULL,
    payment_method public.enum_checkout_sessions_payment_method NOT NULL,
    payment_data jsonb,
    order_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    active_key character varying
);


--
-- Name: checkout_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.checkout_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checkout_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.checkout_sessions_id_seq OWNED BY public.checkout_sessions.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code character varying NOT NULL,
    discount_type public.enum_coupons_discount_type NOT NULL,
    amount numeric NOT NULL,
    usage_limit numeric,
    used_count numeric DEFAULT 0,
    starts_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone,
    status public.enum_coupons_status DEFAULT 'active'::public.enum_coupons_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    title character varying NOT NULL,
    description character varying,
    benefit_summary character varying,
    code_mode public.enum_coupons_code_mode DEFAULT 'manual'::public.enum_coupons_code_mode NOT NULL,
    code_prefix character varying,
    minimum_spend numeric DEFAULT 0,
    per_user_limit numeric DEFAULT 1,
    ttl_hours numeric,
    send_whats_app_blast boolean DEFAULT false,
    whats_app_blast_sent_at timestamp(3) with time zone,
    whats_app_blast_recipient_count numeric
);


--
-- Name: coupons_allowed_tiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons_allowed_tiers (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_coupons_allowed_tiers,
    id integer NOT NULL
);


--
-- Name: coupons_allowed_tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupons_allowed_tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupons_allowed_tiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupons_allowed_tiers_id_seq OWNED BY public.coupons_allowed_tiers.id;


--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: digital_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_assets (
    id integer NOT NULL,
    product_id integer NOT NULL,
    file_id integer NOT NULL,
    file_name character varying NOT NULL,
    file_size numeric,
    version character varying DEFAULT '1.0.0'::character varying,
    changelog character varying,
    protected boolean DEFAULT true,
    status public.enum_digital_assets_status DEFAULT 'active'::public.enum_digital_assets_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: digital_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.digital_assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: digital_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.digital_assets_id_seq OWNED BY public.digital_assets.id;


--
-- Name: digital_stock_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.digital_stock_units (
    id integer NOT NULL,
    unit_code character varying NOT NULL,
    product_id integer NOT NULL,
    variant character varying,
    status public.enum_digital_stock_units_status DEFAULT 'available'::public.enum_digital_stock_units_status NOT NULL,
    delivery_type public.enum_digital_stock_units_delivery_type DEFAULT 'credentials'::public.enum_digital_stock_units_delivery_type NOT NULL,
    label character varying,
    account_email character varying,
    account_username character varying,
    account_password character varying,
    login_url character varying,
    reference_code character varying,
    content character varying,
    file_id integer,
    reservation_id character varying,
    customer_id integer,
    order_id integer,
    assigned_at timestamp(3) with time zone,
    notes character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: digital_stock_units_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.digital_stock_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: digital_stock_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.digital_stock_units_id_seq OWNED BY public.digital_stock_units.id;


--
-- Name: download_access; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_access (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    asset_id integer NOT NULL,
    status public.enum_download_access_status DEFAULT 'active'::public.enum_download_access_status NOT NULL,
    max_downloads numeric DEFAULT 10,
    download_count numeric DEFAULT 0,
    expires_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: download_access_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_access_id_seq OWNED BY public.download_access.id;


--
-- Name: download_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.download_logs (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    asset_id integer NOT NULL,
    order_id integer NOT NULL,
    ip character varying,
    user_agent character varying,
    downloaded_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: download_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.download_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: download_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.download_logs_id_seq OWNED BY public.download_logs.id;


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id integer NOT NULL,
    name character varying NOT NULL,
    subject character varying NOT NULL,
    body character varying NOT NULL,
    type public.enum_email_templates_type NOT NULL,
    status public.enum_email_templates_status DEFAULT 'active'::public.enum_email_templates_status NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;


--
-- Name: footer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: footer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.footer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: footer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.footer_id_seq OWNED BY public.footer.id;


--
-- Name: footer_nav_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_nav_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    link_type public.enum_footer_nav_items_link_type DEFAULT 'reference'::public.enum_footer_nav_items_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying NOT NULL
);


--
-- Name: footer_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer
);


--
-- Name: footer_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.footer_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: footer_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.footer_rels_id_seq OWNED BY public.footer_rels.id;


--
-- Name: form_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_submissions (
    id integer NOT NULL,
    form_id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.form_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: form_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.form_submissions_id_seq OWNED BY public.form_submissions.id;


--
-- Name: form_submissions_submission_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.form_submissions_submission_data (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    field character varying NOT NULL,
    value character varying NOT NULL
);


--
-- Name: forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms (
    id integer NOT NULL,
    title character varying NOT NULL,
    submit_button_label character varying,
    confirmation_type public.enum_forms_confirmation_type DEFAULT 'message'::public.enum_forms_confirmation_type,
    confirmation_message jsonb,
    redirect_url character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: forms_blocks_checkbox; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_checkbox (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    required boolean,
    default_value boolean,
    block_name character varying
);


--
-- Name: forms_blocks_country; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_country (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_email; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_email (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_message (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    message jsonb,
    block_name character varying
);


--
-- Name: forms_blocks_number; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_number (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    default_value numeric,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_select; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_select (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    default_value character varying,
    placeholder character varying,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_select_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_select_options (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying NOT NULL,
    value character varying NOT NULL
);


--
-- Name: forms_blocks_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_state (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_text; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_text (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    default_value character varying,
    required boolean,
    block_name character varying
);


--
-- Name: forms_blocks_textarea; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_blocks_textarea (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    label character varying,
    width numeric,
    default_value character varying,
    required boolean,
    block_name character varying
);


--
-- Name: forms_emails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forms_emails (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    email_to character varying,
    cc character varying,
    bcc character varying,
    reply_to character varying,
    email_from character varying,
    subject character varying DEFAULT 'You''ve received a new message.'::character varying NOT NULL,
    message jsonb
);


--
-- Name: forms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forms_id_seq OWNED BY public.forms.id;


--
-- Name: header; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.header (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: header_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.header_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: header_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.header_id_seq OWNED BY public.header.id;


--
-- Name: header_nav_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.header_nav_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    link_type public.enum_header_nav_items_link_type DEFAULT 'reference'::public.enum_header_nav_items_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying NOT NULL
);


--
-- Name: header_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.header_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer
);


--
-- Name: header_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.header_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: header_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.header_rels_id_seq OWNED BY public.header_rels.id;


--
-- Name: licenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.licenses (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    license_key character varying NOT NULL,
    status public.enum_licenses_status DEFAULT 'active'::public.enum_licenses_status NOT NULL,
    max_activations numeric DEFAULT 1,
    activation_count numeric DEFAULT 0,
    expires_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.licenses_id_seq OWNED BY public.licenses.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    caption jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    uploaded_by_id integer,
    is_support_attachment boolean DEFAULT false
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    shipping_address_title character varying,
    shipping_address_first_name character varying,
    shipping_address_last_name character varying,
    shipping_address_company character varying,
    shipping_address_address_line1 character varying,
    shipping_address_address_line2 character varying,
    shipping_address_city character varying,
    shipping_address_state character varying,
    shipping_address_postal_code character varying,
    shipping_address_country character varying,
    shipping_address_phone character varying,
    customer_id integer,
    customer_email character varying,
    status public.enum_orders_status DEFAULT 'processing'::public.enum_orders_status,
    amount numeric,
    currency public.enum_orders_currency DEFAULT 'IDR'::public.enum_orders_currency,
    access_token character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    voucher_id integer,
    voucher_code character varying,
    subtotal_before_discount numeric,
    discount_amount numeric,
    member_tier_snapshot public.enum_orders_member_tier_snapshot,
    points_earned numeric DEFAULT 0,
    payment_reference character varying
);


--
-- Name: orders_digital_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders_digital_deliveries (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    product_id integer NOT NULL,
    product_title character varying,
    variant character varying,
    variant_title character varying,
    quantity numeric NOT NULL
);


--
-- Name: orders_digital_deliveries_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders_digital_deliveries_units (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    unit_code character varying,
    delivery_type public.enum_orders_digital_deliveries_units_delivery_type,
    label character varying,
    account_email character varying,
    account_username character varying,
    account_password character varying,
    login_url character varying,
    reference_code character varying,
    content character varying,
    file_id integer
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: orders_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    product_id integer,
    variant_id integer,
    quantity numeric DEFAULT 1 NOT NULL
);


--
-- Name: orders_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    transactions_id integer
);


--
-- Name: orders_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_rels_id_seq OWNED BY public.orders_rels.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title character varying,
    published_on timestamp(3) with time zone,
    hero_type public.enum_pages_hero_type DEFAULT 'flashSale'::public.enum_pages_hero_type,
    hero_rich_text jsonb,
    hero_media_id integer,
    meta_title character varying,
    meta_image_id integer,
    meta_description character varying,
    generate_slug boolean DEFAULT true,
    slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_pages_status DEFAULT 'draft'::public.enum_pages_status
);


--
-- Name: pages_blocks_archive; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_archive (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    intro_content jsonb,
    populate_by public.enum_pages_blocks_archive_populate_by DEFAULT 'collection'::public.enum_pages_blocks_archive_populate_by,
    relation_to public.enum_pages_blocks_archive_relation_to DEFAULT 'products'::public.enum_pages_blocks_archive_relation_to,
    "limit" numeric DEFAULT 10,
    block_name character varying
);


--
-- Name: pages_blocks_banner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    style public.enum_pages_blocks_banner_style DEFAULT 'info'::public.enum_pages_blocks_banner_style,
    content jsonb,
    block_name character varying
);


--
-- Name: pages_blocks_carousel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_carousel (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    populate_by public.enum_pages_blocks_carousel_populate_by DEFAULT 'collection'::public.enum_pages_blocks_carousel_populate_by,
    relation_to public.enum_pages_blocks_carousel_relation_to DEFAULT 'products'::public.enum_pages_blocks_carousel_relation_to,
    "limit" numeric DEFAULT 10,
    populated_docs_total numeric,
    block_name character varying
);


--
-- Name: pages_blocks_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);


--
-- Name: pages_blocks_content_columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_content_columns (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    size public.enum_pages_blocks_content_columns_size DEFAULT 'oneThird'::public.enum_pages_blocks_content_columns_size,
    rich_text jsonb,
    enable_link boolean,
    link_type public.enum_pages_blocks_content_columns_link_type DEFAULT 'reference'::public.enum_pages_blocks_content_columns_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum_pages_blocks_content_columns_link_appearance DEFAULT 'default'::public.enum_pages_blocks_content_columns_link_appearance
);


--
-- Name: pages_blocks_cta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_cta (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    rich_text jsonb,
    block_name character varying
);


--
-- Name: pages_blocks_cta_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_cta_links (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    link_type public.enum_pages_blocks_cta_links_link_type DEFAULT 'reference'::public.enum_pages_blocks_cta_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum_pages_blocks_cta_links_link_appearance DEFAULT 'default'::public.enum_pages_blocks_cta_links_link_appearance
);


--
-- Name: pages_blocks_form_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_form_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    form_id integer,
    enable_intro boolean,
    intro_content jsonb,
    block_name character varying
);


--
-- Name: pages_blocks_media_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_media_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    media_id integer,
    block_name character varying
);


--
-- Name: pages_blocks_three_item_grid; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_blocks_three_item_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);


--
-- Name: pages_hero_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_hero_links (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    link_type public.enum_pages_hero_links_link_type DEFAULT 'reference'::public.enum_pages_hero_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum_pages_hero_links_link_appearance DEFAULT 'default'::public.enum_pages_hero_links_link_appearance
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: pages_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer,
    categories_id integer,
    products_id integer
);


--
-- Name: pages_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_rels_id_seq OWNED BY public.pages_rels.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    pages_id integer,
    categories_id integer,
    media_id integer,
    forms_id integer,
    form_submissions_id integer,
    addresses_id integer,
    variants_id integer,
    variant_types_id integer,
    variant_options_id integer,
    products_id integer,
    carts_id integer,
    orders_id integer,
    transactions_id integer,
    digital_assets_id integer,
    download_access_id integer,
    download_logs_id integer,
    licenses_id integer,
    payment_transactions_id integer,
    coupons_id integer,
    support_tickets_id integer,
    support_messages_id integer,
    email_templates_id integer,
    promo_banners_id integer,
    testimonials_id integer,
    stock_reservations_id integer,
    stock_ledger_id integer,
    checkout_sessions_id integer,
    digital_stock_units_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_transactions (
    id integer NOT NULL,
    order_id integer NOT NULL,
    customer_id integer NOT NULL,
    provider public.enum_payment_transactions_provider NOT NULL,
    provider_transaction_id character varying NOT NULL,
    amount numeric NOT NULL,
    currency character varying DEFAULT 'IDR'::character varying NOT NULL,
    status public.enum_payment_transactions_status DEFAULT 'created'::public.enum_payment_transactions_status NOT NULL,
    raw_payload jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payment_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_transactions_id_seq OWNED BY public.payment_transactions.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying,
    description jsonb,
    inventory numeric DEFAULT 0,
    enable_variants boolean,
    price_in_u_s_d_enabled boolean,
    price_in_u_s_d numeric,
    meta_title character varying,
    meta_image_id integer,
    meta_description character varying,
    generate_slug boolean DEFAULT true,
    slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(3) with time zone,
    _status public.enum_products_status DEFAULT 'draft'::public.enum_products_status,
    short_description character varying,
    product_type public.enum_products_product_type DEFAULT 'digital'::public.enum_products_product_type,
    license_type public.enum_products_license_type DEFAULT 'standard'::public.enum_products_license_type,
    version character varying DEFAULT '1.0.0'::character varying,
    update_policy character varying,
    refund_policy character varying,
    is_featured boolean DEFAULT false,
    badge public.enum_products_badge,
    price_in_i_d_r_enabled boolean,
    price_in_i_d_r numeric,
    promo_is_flash_sale boolean DEFAULT false,
    promo_flash_sale_end_date timestamp(3) with time zone,
    promo_discount_percent numeric,
    digital_fulfillment_mode public.enum_products_digital_fulfillment_mode DEFAULT 'standard'::public.enum_products_digital_fulfillment_mode
);


--
-- Name: products_blocks_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_blocks_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);


--
-- Name: products_blocks_content_columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_blocks_content_columns (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    size public.enum_products_blocks_content_columns_size DEFAULT 'oneThird'::public.enum_products_blocks_content_columns_size,
    rich_text jsonb,
    enable_link boolean,
    link_type public.enum_products_blocks_content_columns_link_type DEFAULT 'reference'::public.enum_products_blocks_content_columns_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum_products_blocks_content_columns_link_appearance DEFAULT 'default'::public.enum_products_blocks_content_columns_link_appearance
);


--
-- Name: products_blocks_cta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_blocks_cta (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    rich_text jsonb,
    block_name character varying
);


--
-- Name: products_blocks_cta_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_blocks_cta_links (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    link_type public.enum_products_blocks_cta_links_link_type DEFAULT 'reference'::public.enum_products_blocks_cta_links_link_type,
    link_new_tab boolean,
    link_url character varying,
    link_label character varying,
    link_appearance public.enum_products_blocks_cta_links_link_appearance DEFAULT 'default'::public.enum_products_blocks_cta_links_link_appearance
);


--
-- Name: products_blocks_media_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_blocks_media_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    media_id integer,
    block_name character varying
);


--
-- Name: products_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    variant_option_id integer
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: products_included_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_included_files (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying,
    format character varying,
    size character varying
);


--
-- Name: products_product_f_a_q; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_product_f_a_q (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer character varying
);


--
-- Name: products_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    pages_id integer,
    variant_types_id integer,
    products_id integer,
    categories_id integer
);


--
-- Name: products_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_rels_id_seq OWNED BY public.products_rels.id;


--
-- Name: promo_banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promo_banners (
    id integer NOT NULL,
    title character varying NOT NULL,
    image_id integer NOT NULL,
    link character varying,
    status public.enum_promo_banners_status DEFAULT 'draft'::public.enum_promo_banners_status NOT NULL,
    priority numeric DEFAULT 0,
    start_date timestamp(3) with time zone,
    end_date timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: promo_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.promo_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: promo_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.promo_banners_id_seq OWNED BY public.promo_banners.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    store_name character varying DEFAULT 'zyho'::character varying NOT NULL,
    logo_id integer,
    favicon_id integer,
    primary_color character varying DEFAULT '#111827'::character varying,
    support_email character varying,
    payment_config jsonb,
    email_config jsonb,
    storage_config jsonb,
    legal_pages_terms_page_id integer,
    legal_pages_privacy_page_id integer,
    legal_pages_refund_page_id integer,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone,
    trust_badges_total_users character varying DEFAULT '10,000+'::character varying,
    trust_badges_satisfaction_rate character varying DEFAULT '99%'::character varying,
    trust_badges_support_availability character varying DEFAULT '24/7'::character varying,
    commerce_enable_u_s_d boolean DEFAULT false
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: settings_trust_badges_partner_logos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings_trust_badges_partner_logos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    logo_id integer NOT NULL,
    name character varying NOT NULL
);


--
-- Name: stock_adjustment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_adjustment (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: stock_adjustment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_adjustment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_adjustment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_adjustment_id_seq OWNED BY public.stock_adjustment.id;


--
-- Name: stock_ledger; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_ledger (
    id integer NOT NULL,
    product_id integer NOT NULL,
    variant character varying,
    type public.enum_stock_ledger_type NOT NULL,
    qty numeric NOT NULL,
    stock_before numeric NOT NULL,
    stock_after numeric NOT NULL,
    reference_id character varying,
    order_id integer,
    customer_id integer,
    performed_by_id integer,
    notes character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: stock_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_ledger_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_ledger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_ledger_id_seq OWNED BY public.stock_ledger.id;


--
-- Name: stock_reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_reservations (
    id integer NOT NULL,
    reservation_id character varying NOT NULL,
    product_id integer NOT NULL,
    variant character varying,
    quantity numeric NOT NULL,
    status public.enum_stock_reservations_status DEFAULT 'pending'::public.enum_stock_reservations_status NOT NULL,
    expires_at timestamp(3) with time zone NOT NULL,
    order_id integer,
    customer_id integer,
    cart_id character varying,
    notes character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: stock_reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_reservations_id_seq OWNED BY public.stock_reservations.id;


--
-- Name: support_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.support_messages (
    id integer NOT NULL,
    ticket_id integer NOT NULL,
    sender_id integer NOT NULL,
    sender_role public.enum_support_messages_sender_role NOT NULL,
    message character varying NOT NULL,
    is_internal_note boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: support_messages_attachments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.support_messages_attachments (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    file_id integer NOT NULL
);


--
-- Name: support_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.support_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: support_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.support_messages_id_seq OWNED BY public.support_messages.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    ticket_number character varying,
    customer_id integer NOT NULL,
    related_order_id integer,
    related_product_id integer,
    subject character varying NOT NULL,
    category public.enum_support_tickets_category NOT NULL,
    priority public.enum_support_tickets_priority DEFAULT 'medium'::public.enum_support_tickets_priority NOT NULL,
    status public.enum_support_tickets_status DEFAULT 'open'::public.enum_support_tickets_status NOT NULL,
    assigned_to_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id integer NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    avatar_id integer,
    comment_id character varying NOT NULL,
    comment_en character varying NOT NULL,
    rating numeric DEFAULT 5 NOT NULL,
    status public.enum_testimonials_status DEFAULT 'draft'::public.enum_testimonials_status NOT NULL,
    priority numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: testimonials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.testimonials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: testimonials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.testimonials_id_seq OWNED BY public.testimonials.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    payment_method public.enum_transactions_payment_method,
    billing_address_title character varying,
    billing_address_first_name character varying,
    billing_address_last_name character varying,
    billing_address_company character varying,
    billing_address_address_line1 character varying,
    billing_address_address_line2 character varying,
    billing_address_city character varying,
    billing_address_state character varying,
    billing_address_postal_code character varying,
    billing_address_country character varying,
    billing_address_phone character varying,
    status public.enum_transactions_status DEFAULT 'pending'::public.enum_transactions_status NOT NULL,
    customer_id integer,
    customer_email character varying,
    order_id integer,
    cart_id integer,
    amount numeric,
    currency public.enum_transactions_currency DEFAULT 'IDR'::public.enum_transactions_currency,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    pakasir_pakasir_order_i_d character varying,
    nowpayments_nowpayments_payment_i_d character varying,
    nowpayments_pay_currency character varying
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: transactions_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    product_id integer,
    variant_id integer,
    quantity numeric DEFAULT 1 NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone,
    google_id character varying,
    avatar_id integer,
    status public.enum_users_status DEFAULT 'active'::public.enum_users_status,
    member_tier public.enum_users_member_tier DEFAULT 'bronze'::public.enum_users_member_tier,
    total_spent_i_d_r numeric DEFAULT 0,
    member_since timestamp(3) with time zone,
    google_avatar_u_r_l character varying,
    phone character varying,
    delete_account_requested_at timestamp(3) with time zone,
    delete_account_reason character varying,
    membership_points numeric DEFAULT 0
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_roles (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_users_roles,
    id integer NOT NULL
);


--
-- Name: users_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_roles_id_seq OWNED BY public.users_roles.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: variant_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_options (
    id integer NOT NULL,
    _variantoptions_options_order character varying,
    variant_type_id integer NOT NULL,
    label character varying NOT NULL,
    value character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(3) with time zone
);


--
-- Name: variant_options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variant_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variant_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variant_options_id_seq OWNED BY public.variant_options.id;


--
-- Name: variant_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variant_types (
    id integer NOT NULL,
    label character varying NOT NULL,
    name character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(3) with time zone
);


--
-- Name: variant_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variant_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variant_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variant_types_id_seq OWNED BY public.variant_types.id;


--
-- Name: variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variants (
    id integer NOT NULL,
    title character varying,
    product_id integer,
    inventory numeric DEFAULT 0,
    price_in_u_s_d_enabled boolean,
    price_in_u_s_d numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(3) with time zone,
    _status public.enum_variants_status DEFAULT 'draft'::public.enum_variants_status,
    price_in_i_d_r_enabled boolean,
    price_in_i_d_r numeric
);


--
-- Name: variants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variants_id_seq OWNED BY public.variants.id;


--
-- Name: variants_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variants_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    variant_options_id integer
);


--
-- Name: variants_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variants_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variants_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variants_rels_id_seq OWNED BY public.variants_rels.id;


--
-- Name: whatsapp_blast_test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.whatsapp_blast_test (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: whatsapp_blast_test_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.whatsapp_blast_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: whatsapp_blast_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.whatsapp_blast_test_id_seq OWNED BY public.whatsapp_blast_test.id;


--
-- Name: _pages_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v ALTER COLUMN id SET DEFAULT nextval('public._pages_v_id_seq'::regclass);


--
-- Name: _pages_v_blocks_archive id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_archive ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_archive_id_seq'::regclass);


--
-- Name: _pages_v_blocks_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_banner ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_banner_id_seq'::regclass);


--
-- Name: _pages_v_blocks_carousel id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_carousel ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_carousel_id_seq'::regclass);


--
-- Name: _pages_v_blocks_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_content_id_seq'::regclass);


--
-- Name: _pages_v_blocks_content_columns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content_columns ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_content_columns_id_seq'::regclass);


--
-- Name: _pages_v_blocks_cta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_cta_id_seq'::regclass);


--
-- Name: _pages_v_blocks_cta_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta_links ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_cta_links_id_seq'::regclass);


--
-- Name: _pages_v_blocks_form_block id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_form_block ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_form_block_id_seq'::regclass);


--
-- Name: _pages_v_blocks_media_block id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_media_block ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_media_block_id_seq'::regclass);


--
-- Name: _pages_v_blocks_three_item_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_three_item_grid ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_three_item_grid_id_seq'::regclass);


--
-- Name: _pages_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels ALTER COLUMN id SET DEFAULT nextval('public._pages_v_rels_id_seq'::regclass);


--
-- Name: _pages_v_version_hero_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_version_hero_links ALTER COLUMN id SET DEFAULT nextval('public._pages_v_version_hero_links_id_seq'::regclass);


--
-- Name: _products_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v ALTER COLUMN id SET DEFAULT nextval('public._products_v_id_seq'::regclass);


--
-- Name: _products_v_blocks_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content ALTER COLUMN id SET DEFAULT nextval('public._products_v_blocks_content_id_seq'::regclass);


--
-- Name: _products_v_blocks_content_columns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content_columns ALTER COLUMN id SET DEFAULT nextval('public._products_v_blocks_content_columns_id_seq'::regclass);


--
-- Name: _products_v_blocks_cta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta ALTER COLUMN id SET DEFAULT nextval('public._products_v_blocks_cta_id_seq'::regclass);


--
-- Name: _products_v_blocks_cta_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta_links ALTER COLUMN id SET DEFAULT nextval('public._products_v_blocks_cta_links_id_seq'::regclass);


--
-- Name: _products_v_blocks_media_block id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_media_block ALTER COLUMN id SET DEFAULT nextval('public._products_v_blocks_media_block_id_seq'::regclass);


--
-- Name: _products_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels ALTER COLUMN id SET DEFAULT nextval('public._products_v_rels_id_seq'::regclass);


--
-- Name: _products_v_version_gallery id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_gallery ALTER COLUMN id SET DEFAULT nextval('public._products_v_version_gallery_id_seq'::regclass);


--
-- Name: _products_v_version_included_files id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_included_files ALTER COLUMN id SET DEFAULT nextval('public._products_v_version_included_files_id_seq'::regclass);


--
-- Name: _products_v_version_product_f_a_q id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_product_f_a_q ALTER COLUMN id SET DEFAULT nextval('public._products_v_version_product_f_a_q_id_seq'::regclass);


--
-- Name: _variants_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v ALTER COLUMN id SET DEFAULT nextval('public._variants_v_id_seq'::regclass);


--
-- Name: _variants_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v_rels ALTER COLUMN id SET DEFAULT nextval('public._variants_v_rels_id_seq'::regclass);


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: checkout_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkout_sessions ALTER COLUMN id SET DEFAULT nextval('public.checkout_sessions_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: coupons_allowed_tiers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons_allowed_tiers ALTER COLUMN id SET DEFAULT nextval('public.coupons_allowed_tiers_id_seq'::regclass);


--
-- Name: digital_assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_assets ALTER COLUMN id SET DEFAULT nextval('public.digital_assets_id_seq'::regclass);


--
-- Name: digital_stock_units id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units ALTER COLUMN id SET DEFAULT nextval('public.digital_stock_units_id_seq'::regclass);


--
-- Name: download_access id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access ALTER COLUMN id SET DEFAULT nextval('public.download_access_id_seq'::regclass);


--
-- Name: download_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs ALTER COLUMN id SET DEFAULT nextval('public.download_logs_id_seq'::regclass);


--
-- Name: email_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);


--
-- Name: footer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer ALTER COLUMN id SET DEFAULT nextval('public.footer_id_seq'::regclass);


--
-- Name: footer_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_rels ALTER COLUMN id SET DEFAULT nextval('public.footer_rels_id_seq'::regclass);


--
-- Name: form_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions ALTER COLUMN id SET DEFAULT nextval('public.form_submissions_id_seq'::regclass);


--
-- Name: forms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms ALTER COLUMN id SET DEFAULT nextval('public.forms_id_seq'::regclass);


--
-- Name: header id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header ALTER COLUMN id SET DEFAULT nextval('public.header_id_seq'::regclass);


--
-- Name: header_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_rels ALTER COLUMN id SET DEFAULT nextval('public.header_rels_id_seq'::regclass);


--
-- Name: licenses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.licenses ALTER COLUMN id SET DEFAULT nextval('public.licenses_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: orders_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_rels ALTER COLUMN id SET DEFAULT nextval('public.orders_rels_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: pages_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels ALTER COLUMN id SET DEFAULT nextval('public.pages_rels_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: payment_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions ALTER COLUMN id SET DEFAULT nextval('public.payment_transactions_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: products_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels ALTER COLUMN id SET DEFAULT nextval('public.products_rels_id_seq'::regclass);


--
-- Name: promo_banners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_banners ALTER COLUMN id SET DEFAULT nextval('public.promo_banners_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: stock_adjustment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_adjustment ALTER COLUMN id SET DEFAULT nextval('public.stock_adjustment_id_seq'::regclass);


--
-- Name: stock_ledger id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger ALTER COLUMN id SET DEFAULT nextval('public.stock_ledger_id_seq'::regclass);


--
-- Name: stock_reservations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_reservations ALTER COLUMN id SET DEFAULT nextval('public.stock_reservations_id_seq'::regclass);


--
-- Name: support_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages ALTER COLUMN id SET DEFAULT nextval('public.support_messages_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: testimonials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials ALTER COLUMN id SET DEFAULT nextval('public.testimonials_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles ALTER COLUMN id SET DEFAULT nextval('public.users_roles_id_seq'::regclass);


--
-- Name: variant_options id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_options ALTER COLUMN id SET DEFAULT nextval('public.variant_options_id_seq'::regclass);


--
-- Name: variant_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_types ALTER COLUMN id SET DEFAULT nextval('public.variant_types_id_seq'::regclass);


--
-- Name: variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants ALTER COLUMN id SET DEFAULT nextval('public.variants_id_seq'::regclass);


--
-- Name: variants_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants_rels ALTER COLUMN id SET DEFAULT nextval('public.variants_rels_id_seq'::regclass);


--
-- Name: whatsapp_blast_test id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_blast_test ALTER COLUMN id SET DEFAULT nextval('public.whatsapp_blast_test_id_seq'::regclass);


--
-- Data for Name: _pages_v; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v (id, parent_id, version_title, version_published_on, version_hero_type, version_hero_rich_text, version_hero_media_id, version_meta_title, version_meta_image_id, version_meta_description, version_generate_slug, version_slug, version_updated_at, version_created_at, version__status, created_at, updated_at, latest, autosave) FROM stdin;
2	1	Hero	\N	flashSale	\N	\N	\N	\N	\N	t	hero	2026-07-08 20:06:21.795+07	2026-07-08 20:06:03.02+07	draft	2026-07-08 20:06:21.795+07	2026-07-08 20:06:21.795+07	t	t
1	1	\N	\N	flashSale	\N	\N	\N	\N	\N	t	\N	2026-07-08 20:06:03.022+07	2026-07-08 20:06:03.02+07	draft	2026-07-08 20:06:03.134+07	2026-07-08 20:06:03.134+07	f	f
\.


--
-- Data for Name: _pages_v_blocks_archive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_archive (_order, _parent_id, _path, id, intro_content, populate_by, relation_to, "limit", _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_banner; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_banner (_order, _parent_id, _path, id, style, content, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_carousel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_carousel (_order, _parent_id, _path, id, populate_by, relation_to, "limit", populated_docs_total, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_content (_order, _parent_id, _path, id, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_content_columns (_order, _parent_id, id, size, rich_text, enable_link, link_type, link_new_tab, link_url, link_label, link_appearance, _uuid) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_cta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_cta (_order, _parent_id, _path, id, rich_text, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_cta_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance, _uuid) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_form_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_form_block (_order, _parent_id, _path, id, form_id, enable_intro, intro_content, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_media_block (_order, _parent_id, _path, id, media_id, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_blocks_three_item_grid; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_blocks_three_item_grid (_order, _parent_id, _path, id, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _pages_v_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_rels (id, "order", parent_id, path, pages_id, categories_id, products_id) FROM stdin;
\.


--
-- Data for Name: _pages_v_version_hero_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._pages_v_version_hero_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance, _uuid) FROM stdin;
\.


--
-- Data for Name: _products_v; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v (id, parent_id, version_title, version_description, version_inventory, version_enable_variants, version_price_in_u_s_d_enabled, version_price_in_u_s_d, version_meta_title, version_meta_image_id, version_meta_description, version_generate_slug, version_slug, version_updated_at, version_created_at, version_deleted_at, version__status, created_at, updated_at, latest, autosave, version_short_description, version_product_type, version_license_type, version_version, version_update_policy, version_refund_policy, version_is_featured, version_badge, version_price_in_i_d_r_enabled, version_price_in_i_d_r, version_promo_is_flash_sale, version_promo_flash_sale_end_date, version_promo_discount_percent, version_digital_fulfillment_mode) FROM stdin;
1	1	\N	\N	0	\N	\N	\N	\N	\N	\N	t	\N	2026-07-06 14:19:57.305+07	2026-07-06 14:19:57.304+07	\N	draft	2026-07-06 14:19:57.372+07	2026-07-06 14:19:57.372+07	t	f	\N	digital	standard	1.0.0	\N	\N	f	\N	\N	\N	f	\N	\N	standard
45	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 18:54:50.061+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-13 18:54:50.299+07	2026-07-13 18:54:50.299+07	t	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
5	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	30	\N	t	99000	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-06 15:26:23.637+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-06 15:26:23.653+07	2026-07-06 15:26:23.653+07	f	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	\N	\N	f	\N	\N	standard
34	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	36	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 19:10:32.334+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 19:10:32.386+07	2026-07-12 19:10:32.386+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
6	6	AI Prompt Pack Premium	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	999	\N	t	79000	AI Prompt Pack Premium | Citra Commerce	5	1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.	f	ai-prompt-pack-premium	2026-07-06 15:26:23.686+07	2026-07-06 15:26:23.685+07	\N	published	2026-07-06 15:26:23.701+07	2026-07-06 15:26:23.701+07	f	f	Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.	prompt_pack	commercial	3.0	\N	\N	t	best_seller	\N	\N	f	\N	\N	standard
4	4	Midjourney Access Bundle	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Midjourney adalah tool AI image generation terbaik saat ini. Dengan bundle ini, Anda mendapat akses dan panduan lengkap mulai dari dasar hingga teknik advanced seperti style mixing, multi-prompt, dan parameter tuning. Termasuk 500+ prompt template untuk berbagai use case.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	100	\N	t	199000	Midjourney Access Bundle | Citra Commerce	3	Akses Midjourney + panduan lengkap + 500+ prompt template untuk AI image generation profesional.	f	midjourney-access-bundle	2026-07-06 15:26:23.582+07	2026-07-06 15:26:23.582+07	\N	published	2026-07-06 15:26:23.598+07	2026-07-06 15:26:23.598+07	f	f	Akses Midjourney untuk generate gambar AI berkualitas tinggi. Termasuk panduan lengkap dan 500+ prompt siap pakai.	digital	standard	2.0	\N	\N	t	best_seller	\N	\N	f	\N	\N	standard
3	3	Claude Pro Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	40	\N	t	139000	Claude Pro Account | Citra Commerce	2	Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.	f	claude-pro-account	2026-07-06 15:26:23.526+07	2026-07-06 15:26:23.526+07	\N	published	2026-07-06 15:26:23.544+07	2026-07-06 15:26:23.544+07	f	f	Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.	digital	personal	1.0	\N	\N	t	new	\N	\N	f	\N	\N	standard
8	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-08 19:23:15.77+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-08 19:23:15.813+07	2026-07-08 19:23:15.813+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	\N	\N	f	\N	\N	standard
13	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	f	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-08 23:50:42.469+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-08 23:50:42.527+07	2026-07-08 23:50:42.527+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	standard
12	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	f	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-08 23:50:39.52+07	2026-07-06 15:26:23.735+07	\N	draft	2026-07-08 23:50:24.972+07	2026-07-08 23:50:39.52+07	f	t	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	standard
38	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	30	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 20:07:13.842+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 20:07:13.884+07	2026-07-12 20:07:13.884+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
9	6	AI Prompt Pack Premium	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	79000	AI Prompt Pack Premium | Citra Commerce	5	1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.	f	ai-prompt-pack-premium	2026-07-08 19:23:34.249+07	2026-07-06 15:26:23.685+07	\N	published	2026-07-08 19:23:34.314+07	2026-07-08 19:23:34.314+07	f	f	Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.	prompt_pack	commercial	3.0	\N	\N	t	best_seller	\N	\N	f	\N	\N	standard
10	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-08 21:18:02.707+07	2026-07-06 15:26:23.735+07	\N	draft	2026-07-08 20:24:38.522+07	2026-07-08 21:18:02.707+07	f	t	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	\N	\N	t	2026-07-08 00:00:00+07	20	standard
36	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	32	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 19:56:33.031+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 19:56:33.083+07	2026-07-12 19:56:33.083+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
22	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	45	\N	t	9.31	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-09 21:40:58.225+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-09 21:40:58.291+07	2026-07-09 21:40:58.291+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
35	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	34	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 19:52:00.506+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 19:52:00.585+07	2026-07-12 19:52:00.585+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
15	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	46	\N	t	149000	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-09 18:07:05.588+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-09 18:07:05.654+07	2026-07-09 18:07:05.654+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	\N	\N	f	\N	\N	standard
16	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	12.5	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-09 21:09:11.142+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-09 21:09:11.3+07	2026-07-09 21:09:11.3+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	standard
14	3	Claude Pro Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	39	\N	t	139000	Claude Pro Account | Citra Commerce	2	Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.	f	claude-pro-account	2026-07-09 12:45:32.068+07	2026-07-06 15:26:23.526+07	\N	published	2026-07-09 12:45:32.157+07	2026-07-09 12:45:32.157+07	f	f	Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.	digital	personal	1.0	\N	\N	t	new	\N	\N	f	\N	\N	standard
23	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-09 22:25:47.259+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-09 22:25:47.418+07	2026-07-09 22:25:47.418+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	standard
31	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	40	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 18:45:50.789+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 18:45:50.885+07	2026-07-12 18:45:50.885+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
17	6	AI Prompt Pack Premium	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	4.94	AI Prompt Pack Premium | Citra Commerce	5	1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.	f	ai-prompt-pack-premium	2026-07-09 21:09:11.604+07	2026-07-06 15:26:23.685+07	\N	published	2026-07-09 21:09:11.662+07	2026-07-09 21:09:11.662+07	f	f	Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.	prompt_pack	commercial	3.0	\N	\N	t	best_seller	t	79000	f	\N	\N	standard
19	4	Midjourney Access Bundle	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Midjourney adalah tool AI image generation terbaik saat ini. Dengan bundle ini, Anda mendapat akses dan panduan lengkap mulai dari dasar hingga teknik advanced seperti style mixing, multi-prompt, dan parameter tuning. Termasuk 500+ prompt template untuk berbagai use case.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	100	\N	t	12.44	Midjourney Access Bundle | Citra Commerce	3	Akses Midjourney + panduan lengkap + 500+ prompt template untuk AI image generation profesional.	f	midjourney-access-bundle	2026-07-09 21:09:12.2+07	2026-07-06 15:26:23.582+07	\N	published	2026-07-09 21:09:12.258+07	2026-07-09 21:09:12.258+07	f	f	Akses Midjourney untuk generate gambar AI berkualitas tinggi. Termasuk panduan lengkap dan 500+ prompt siap pakai.	digital	standard	2.0	\N	\N	t	best_seller	t	199000	f	\N	\N	standard
20	3	Claude Pro Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	39	\N	t	8.69	Claude Pro Account | Citra Commerce	2	Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.	f	claude-pro-account	2026-07-09 21:09:12.505+07	2026-07-06 15:26:23.526+07	\N	published	2026-07-09 21:09:12.565+07	2026-07-09 21:09:12.565+07	f	f	Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.	digital	personal	1.0	\N	\N	t	new	t	139000	f	\N	\N	standard
24	6	AI Prompt Pack Premium	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	494	AI Prompt Pack Premium | Citra Commerce	5	1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.	f	ai-prompt-pack-premium	2026-07-09 22:25:47.776+07	2026-07-06 15:26:23.685+07	\N	published	2026-07-09 22:25:47.846+07	2026-07-09 22:25:47.846+07	t	f	Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.	prompt_pack	commercial	3.0	\N	\N	t	best_seller	t	79000	f	\N	\N	standard
39	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	25	\N	t	619	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-12 20:24:55.646+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-12 20:24:55.805+07	2026-07-12 20:24:55.805+07	t	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
26	4	Midjourney Access Bundle	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Midjourney adalah tool AI image generation terbaik saat ini. Dengan bundle ini, Anda mendapat akses dan panduan lengkap mulai dari dasar hingga teknik advanced seperti style mixing, multi-prompt, dan parameter tuning. Termasuk 500+ prompt template untuk berbagai use case.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	100	\N	t	1244	Midjourney Access Bundle | Citra Commerce	3	Akses Midjourney + panduan lengkap + 500+ prompt template untuk AI image generation profesional.	f	midjourney-access-bundle	2026-07-09 22:25:48.33+07	2026-07-06 15:26:23.582+07	\N	published	2026-07-09 22:25:48.397+07	2026-07-09 22:25:48.397+07	t	f	Akses Midjourney untuk generate gambar AI berkualitas tinggi. Termasuk panduan lengkap dan 500+ prompt siap pakai.	digital	standard	2.0	\N	\N	t	best_seller	t	199000	f	\N	\N	standard
27	3	Claude Pro Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	39	\N	t	869	Claude Pro Account | Citra Commerce	2	Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.	f	claude-pro-account	2026-07-09 22:25:48.638+07	2026-07-06 15:26:23.526+07	\N	published	2026-07-09 22:25:48.697+07	2026-07-09 22:25:48.697+07	t	f	Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.	digital	personal	1.0	\N	\N	t	new	t	139000	f	\N	\N	standard
32	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	29	\N	t	619	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-12 18:48:53.643+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-12 18:48:53.669+07	2026-07-12 18:48:53.669+07	f	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
33	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	38	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 18:53:31.358+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 18:53:31.419+07	2026-07-12 18:53:31.419+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
37	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	27	\N	t	619	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-12 20:01:44.752+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-12 20:01:44.852+07	2026-07-12 20:01:44.852+07	f	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
18	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	30	\N	t	6.19	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-09 21:09:11.85+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-09 21:09:11.937+07	2026-07-09 21:09:11.937+07	f	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
25	5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	30	\N	t	619	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-09 22:25:48.056+07	2026-07-06 15:26:23.636+07	\N	published	2026-07-09 22:25:48.111+07	2026-07-09 22:25:48.111+07	f	f	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
40	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	28	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 20:24:57.127+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 20:24:57.215+07	2026-07-12 20:24:57.215+07	t	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
2	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	50	\N	t	149000	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-06 15:26:23.389+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-06 15:26:23.417+07	2026-07-06 15:26:23.417+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	\N	\N	f	\N	\N	standard
28	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	45	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-09 22:25:48.941+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-09 22:25:49.017+07	2026-07-09 22:25:49.017+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
30	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	42	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 18:29:27.769+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 18:29:27.822+07	2026-07-12 18:29:27.822+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
21	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	46	\N	t	9.31	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-09 21:09:12.786+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-09 21:09:12.862+07	2026-07-09 21:09:12.862+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
29	2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	44	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 17:46:37.143+07	2026-07-06 15:26:23.387+07	\N	published	2026-07-12 17:46:37.282+07	2026-07-12 17:46:37.282+07	f	f	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
42	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	1	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 01:12:40.073+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-13 01:12:40.283+07	2026-07-13 01:12:40.283+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
41	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 00:55:33.995+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-13 00:55:34.21+07	2026-07-13 00:55:34.21+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
43	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 01:15:49.988+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-13 01:15:50.198+07	2026-07-13 01:15:50.198+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
7	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	50	\N	t	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-06 15:26:23.735+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-06 15:26:23.749+07	2026-07-06 15:26:23.749+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	\N	\N	f	\N	\N	standard
44	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	1	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 01:29:16.564+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-13 01:29:16.65+07	2026-07-13 01:29:16.65+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
11	7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	249000	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-08 21:18:14.798+07	2026-07-06 15:26:23.735+07	\N	published	2026-07-08 21:18:14.908+07	2026-07-08 21:18:14.908+07	f	f	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	\N	\N	t	2026-07-08 00:00:00+07	20	standard
\.


--
-- Data for Name: _products_v_blocks_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_blocks_content (_order, _parent_id, _path, id, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _products_v_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_blocks_content_columns (_order, _parent_id, id, size, rich_text, enable_link, link_type, link_new_tab, link_url, link_label, link_appearance, _uuid) FROM stdin;
\.


--
-- Data for Name: _products_v_blocks_cta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_blocks_cta (_order, _parent_id, _path, id, rich_text, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _products_v_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_blocks_cta_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance, _uuid) FROM stdin;
\.


--
-- Data for Name: _products_v_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_blocks_media_block (_order, _parent_id, _path, id, media_id, _uuid, block_name) FROM stdin;
\.


--
-- Data for Name: _products_v_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_rels (id, "order", parent_id, path, pages_id, variant_types_id, products_id, categories_id) FROM stdin;
1	1	2	version.categories	\N	\N	\N	1
2	1	3	version.categories	\N	\N	\N	1
3	1	4	version.categories	\N	\N	\N	1
4	2	4	version.categories	\N	\N	\N	4
5	1	5	version.categories	\N	\N	\N	1
6	1	6	version.categories	\N	\N	\N	2
7	1	7	version.categories	\N	\N	\N	3
8	1	8	version.categories	\N	\N	\N	3
9	1	9	version.categories	\N	\N	\N	2
13	1	10	version.categories	\N	\N	\N	3
14	1	11	version.categories	\N	\N	\N	3
18	1	12	version.relatedProducts	\N	\N	2	\N
19	1	12	version.categories	\N	\N	\N	3
20	1	13	version.relatedProducts	\N	\N	2	\N
21	1	13	version.categories	\N	\N	\N	3
22	1	14	version.categories	\N	\N	\N	1
23	1	15	version.categories	\N	\N	\N	1
24	1	16	version.relatedProducts	\N	\N	2	\N
25	1	16	version.categories	\N	\N	\N	3
26	1	17	version.categories	\N	\N	\N	2
27	1	18	version.categories	\N	\N	\N	1
28	1	19	version.categories	\N	\N	\N	1
29	2	19	version.categories	\N	\N	\N	4
30	1	20	version.categories	\N	\N	\N	1
31	1	21	version.categories	\N	\N	\N	1
32	1	22	version.categories	\N	\N	\N	1
33	1	23	version.relatedProducts	\N	\N	2	\N
34	1	23	version.categories	\N	\N	\N	3
35	1	24	version.categories	\N	\N	\N	2
36	1	25	version.categories	\N	\N	\N	1
37	1	26	version.categories	\N	\N	\N	1
38	2	26	version.categories	\N	\N	\N	4
39	1	27	version.categories	\N	\N	\N	1
40	1	28	version.categories	\N	\N	\N	1
41	1	29	version.categories	\N	\N	\N	1
42	1	30	version.categories	\N	\N	\N	1
43	1	31	version.categories	\N	\N	\N	1
44	1	32	version.categories	\N	\N	\N	1
45	1	33	version.categories	\N	\N	\N	1
46	1	34	version.categories	\N	\N	\N	1
47	1	35	version.categories	\N	\N	\N	1
48	1	36	version.categories	\N	\N	\N	1
49	1	37	version.categories	\N	\N	\N	1
50	1	38	version.categories	\N	\N	\N	1
51	1	39	version.categories	\N	\N	\N	1
52	1	40	version.categories	\N	\N	\N	1
53	1	41	version.relatedProducts	\N	\N	2	\N
54	1	41	version.categories	\N	\N	\N	3
55	1	42	version.relatedProducts	\N	\N	2	\N
56	1	42	version.categories	\N	\N	\N	3
57	1	43	version.relatedProducts	\N	\N	2	\N
58	1	43	version.categories	\N	\N	\N	3
59	1	44	version.relatedProducts	\N	\N	2	\N
60	1	44	version.categories	\N	\N	\N	3
61	1	45	version.relatedProducts	\N	\N	2	\N
62	1	45	version.categories	\N	\N	\N	3
\.


--
-- Data for Name: _products_v_version_gallery; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_version_gallery (_order, _parent_id, id, image_id, variant_option_id, _uuid) FROM stdin;
1	2	1	1	\N	6a4b66af610ab61a00769ff2
1	3	2	2	\N	6a4b66af610ab61a00769ff8
1	4	3	3	\N	6a4b66af610ab61a00769ffe
1	5	4	4	\N	6a4b66af610ab61a0076a005
1	6	5	5	\N	6a4b66af610ab61a0076a00b
1	7	6	6	\N	6a4b66af610ab61a0076a012
1	8	7	6	\N	6a4b66af610ab61a0076a012
1	9	8	5	\N	6a4b66af610ab61a0076a00b
1	10	12	6	\N	6a4b66af610ab61a0076a012
1	11	13	6	\N	6a4b66af610ab61a0076a012
1	12	17	6	\N	6a4b66af610ab61a0076a012
1	13	18	6	\N	6a4b66af610ab61a0076a012
1	14	19	2	\N	6a4b66af610ab61a00769ff8
1	15	20	1	\N	6a4b66af610ab61a00769ff2
1	16	21	6	\N	6a4b66af610ab61a0076a012
1	17	22	5	\N	6a4b66af610ab61a0076a00b
1	18	23	4	\N	6a4b66af610ab61a0076a005
1	19	24	3	\N	6a4b66af610ab61a00769ffe
1	20	25	2	\N	6a4b66af610ab61a00769ff8
1	21	26	1	\N	6a4b66af610ab61a00769ff2
1	22	27	1	\N	6a4b66af610ab61a00769ff2
1	23	28	6	\N	6a4b66af610ab61a0076a012
1	24	29	5	\N	6a4b66af610ab61a0076a00b
1	25	30	4	\N	6a4b66af610ab61a0076a005
1	26	31	3	\N	6a4b66af610ab61a00769ffe
1	27	32	2	\N	6a4b66af610ab61a00769ff8
1	28	33	1	\N	6a4b66af610ab61a00769ff2
1	29	34	1	\N	6a4b66af610ab61a00769ff2
1	30	35	1	\N	6a4b66af610ab61a00769ff2
1	31	36	1	\N	6a4b66af610ab61a00769ff2
1	32	37	4	\N	6a4b66af610ab61a0076a005
1	33	38	1	\N	6a4b66af610ab61a00769ff2
1	34	39	1	\N	6a4b66af610ab61a00769ff2
1	35	40	1	\N	6a4b66af610ab61a00769ff2
1	36	41	1	\N	6a4b66af610ab61a00769ff2
1	37	42	4	\N	6a4b66af610ab61a0076a005
1	38	43	1	\N	6a4b66af610ab61a00769ff2
1	39	44	4	\N	6a4b66af610ab61a0076a005
1	40	45	1	\N	6a4b66af610ab61a00769ff2
1	41	46	6	\N	6a4b66af610ab61a0076a012
1	42	47	6	\N	6a4b66af610ab61a0076a012
1	43	48	6	\N	6a4b66af610ab61a0076a012
1	44	49	6	\N	6a4b66af610ab61a0076a012
1	45	50	6	\N	6a4b66af610ab61a0076a012
\.


--
-- Data for Name: _products_v_version_included_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_version_included_files (_order, _parent_id, id, label, format, size, _uuid) FROM stdin;
1	2	1	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	2	2	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	3	3	Panduan Aktivasi Claude Pro (PDF)	PDF	1.8 MB	6a4b66af610ab61a00769ff9
2	3	4	Prompt Template Claude untuk Bisnis	PDF	2.2 MB	6a4b66af610ab61a00769ffa
1	4	5	Panduan Midjourney Lengkap (PDF)	PDF	5 MB	6a4b66af610ab61a00769fff
2	4	6	500+ Prompt Template (PDF)	PDF	3 MB	6a4b66af610ab61a0076a000
3	4	7	Cheat Sheet Parameter (PDF)	PDF	1 MB	6a4b66af610ab61a0076a001
1	5	8	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	5	9	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	6	10	1000+ Prompt Pack (Notion Template)	Notion	5 MB	6a4b66af610ab61a0076a00c
2	6	11	PDF Version Lengkap	PDF	8 MB	6a4b66af610ab61a0076a00d
3	6	12	Bonus: Prompt Engineering Guide	PDF	3 MB	6a4b66af610ab61a0076a00e
1	7	13	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	7	14	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	7	15	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	8	16	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	8	17	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	8	18	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	9	19	1000+ Prompt Pack (Notion Template)	Notion	5 MB	6a4b66af610ab61a0076a00c
2	9	20	PDF Version Lengkap	PDF	8 MB	6a4b66af610ab61a0076a00d
3	9	21	Bonus: Prompt Engineering Guide	PDF	3 MB	6a4b66af610ab61a0076a00e
1	10	31	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	10	32	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	10	33	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	11	34	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	11	35	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	11	36	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	12	46	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	12	47	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	12	48	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	13	49	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	13	50	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	13	51	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	14	52	Panduan Aktivasi Claude Pro (PDF)	PDF	1.8 MB	6a4b66af610ab61a00769ff9
2	14	53	Prompt Template Claude untuk Bisnis	PDF	2.2 MB	6a4b66af610ab61a00769ffa
1	15	54	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	15	55	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	16	56	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	16	57	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	16	58	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	17	59	1000+ Prompt Pack (Notion Template)	Notion	5 MB	6a4b66af610ab61a0076a00c
2	17	60	PDF Version Lengkap	PDF	8 MB	6a4b66af610ab61a0076a00d
3	17	61	Bonus: Prompt Engineering Guide	PDF	3 MB	6a4b66af610ab61a0076a00e
1	18	62	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	18	63	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	19	64	Panduan Midjourney Lengkap (PDF)	PDF	5 MB	6a4b66af610ab61a00769fff
2	19	65	500+ Prompt Template (PDF)	PDF	3 MB	6a4b66af610ab61a0076a000
3	19	66	Cheat Sheet Parameter (PDF)	PDF	1 MB	6a4b66af610ab61a0076a001
1	20	67	Panduan Aktivasi Claude Pro (PDF)	PDF	1.8 MB	6a4b66af610ab61a00769ff9
2	20	68	Prompt Template Claude untuk Bisnis	PDF	2.2 MB	6a4b66af610ab61a00769ffa
1	21	69	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	21	70	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	22	71	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	22	72	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	23	73	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	23	74	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	23	75	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	24	76	1000+ Prompt Pack (Notion Template)	Notion	5 MB	6a4b66af610ab61a0076a00c
2	24	77	PDF Version Lengkap	PDF	8 MB	6a4b66af610ab61a0076a00d
3	24	78	Bonus: Prompt Engineering Guide	PDF	3 MB	6a4b66af610ab61a0076a00e
1	25	79	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	25	80	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	26	81	Panduan Midjourney Lengkap (PDF)	PDF	5 MB	6a4b66af610ab61a00769fff
2	26	82	500+ Prompt Template (PDF)	PDF	3 MB	6a4b66af610ab61a0076a000
3	26	83	Cheat Sheet Parameter (PDF)	PDF	1 MB	6a4b66af610ab61a0076a001
1	27	84	Panduan Aktivasi Claude Pro (PDF)	PDF	1.8 MB	6a4b66af610ab61a00769ff9
2	27	85	Prompt Template Claude untuk Bisnis	PDF	2.2 MB	6a4b66af610ab61a00769ffa
1	28	86	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	28	87	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	29	88	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	29	89	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	30	90	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	30	91	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	31	92	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	31	93	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	32	94	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	32	95	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	33	96	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	33	97	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	34	98	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	34	99	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	35	100	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	35	101	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	36	102	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	36	103	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	37	104	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	37	105	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	38	106	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	38	107	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	39	108	Panduan Setup Copilot (PDF)	PDF	1.5 MB	6a4b66af610ab61a0076a006
2	39	109	Tips Copilot untuk Developer	PDF	1 MB	6a4b66af610ab61a0076a007
1	40	110	Panduan Aktivasi Akun (PDF)	PDF	2 MB	6a4b66af610ab61a00769ff3
2	40	111	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB	6a4b66af610ab61a00769ff4
1	41	112	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	41	113	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	41	114	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	42	115	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	42	116	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	42	117	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	43	118	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	43	119	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	43	120	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	44	121	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	44	122	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	44	123	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
1	45	124	50+ Workflow Templates (JSON)	JSON	2 MB	6a4b66af610ab61a0076a013
2	45	125	Panduan Setup & Import (PDF)	PDF	4 MB	6a4b66af610ab61a0076a014
3	45	126	Video Tutorial (MP4)	MP4	500 MB	6a4b66af610ab61a0076a015
\.


--
-- Data for Name: _products_v_version_product_f_a_q; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._products_v_version_product_f_a_q (_order, _parent_id, id, question, answer, _uuid) FROM stdin;
1	2	1	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	2	2	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	2	3	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	3	4	Apa bedanya Claude Pro dan ChatGPT Plus?	Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.	6a4b66af610ab61a00769ffb
2	3	5	Berapa lama garansi akun?	Garansi 30 hari penggantian jika akun bermasalah.	6a4b66af610ab61a00769ffc
3	3	6	Bisa upload file?	Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.	6a4b66af610ab61a00769ffd
1	4	7	Apakah ini akun Midjourney?	Ini adalah bundle akses + panduan + prompt template. Detail akses diberikan setelah pembelian.	6a4b66af610ab61a0076a002
2	4	8	Untuk siapa produk ini?	Cocok untuk desainer, content creator, marketer, dan siapa saja yang butuh gambar AI berkualitas tinggi.	6a4b66af610ab61a0076a003
3	4	9	Apakah prompt bisa diedit?	Ya, semua prompt template bisa dimodifikasi sesuai kebutuhan Anda.	6a4b66af610ab61a0076a004
1	5	10	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	5	11	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	5	12	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	6	13	Untuk AI apa saja prompt ini?	Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.	6a4b66af610ab61a0076a00f
2	6	14	Bisa dipakai untuk klien?	Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.	6a4b66af610ab61a0076a010
3	6	15	Apakah update gratis?	Ya, semua update prompt baru akan dikirim ke email pembeli.	6a4b66af610ab61a0076a011
1	7	16	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	7	17	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	7	18	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	8	19	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	8	20	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	8	21	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	9	22	Untuk AI apa saja prompt ini?	Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.	6a4b66af610ab61a0076a00f
2	9	23	Bisa dipakai untuk klien?	Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.	6a4b66af610ab61a0076a010
3	9	24	Apakah update gratis?	Ya, semua update prompt baru akan dikirim ke email pembeli.	6a4b66af610ab61a0076a011
1	10	34	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	10	35	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	10	36	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	11	37	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	11	38	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	11	39	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	12	49	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	12	50	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	12	51	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	13	52	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	13	53	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	13	54	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	14	55	Apa bedanya Claude Pro dan ChatGPT Plus?	Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.	6a4b66af610ab61a00769ffb
2	14	56	Berapa lama garansi akun?	Garansi 30 hari penggantian jika akun bermasalah.	6a4b66af610ab61a00769ffc
3	14	57	Bisa upload file?	Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.	6a4b66af610ab61a00769ffd
1	15	58	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	15	59	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	15	60	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	16	61	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	16	62	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	16	63	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	17	64	Untuk AI apa saja prompt ini?	Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.	6a4b66af610ab61a0076a00f
2	17	65	Bisa dipakai untuk klien?	Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.	6a4b66af610ab61a0076a010
3	17	66	Apakah update gratis?	Ya, semua update prompt baru akan dikirim ke email pembeli.	6a4b66af610ab61a0076a011
1	18	67	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	18	68	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	18	69	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	19	70	Apakah ini akun Midjourney?	Ini adalah bundle akses + panduan + prompt template. Detail akses diberikan setelah pembelian.	6a4b66af610ab61a0076a002
2	19	71	Untuk siapa produk ini?	Cocok untuk desainer, content creator, marketer, dan siapa saja yang butuh gambar AI berkualitas tinggi.	6a4b66af610ab61a0076a003
3	19	72	Apakah prompt bisa diedit?	Ya, semua prompt template bisa dimodifikasi sesuai kebutuhan Anda.	6a4b66af610ab61a0076a004
1	20	73	Apa bedanya Claude Pro dan ChatGPT Plus?	Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.	6a4b66af610ab61a00769ffb
2	20	74	Berapa lama garansi akun?	Garansi 30 hari penggantian jika akun bermasalah.	6a4b66af610ab61a00769ffc
3	20	75	Bisa upload file?	Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.	6a4b66af610ab61a00769ffd
1	21	76	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	21	77	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	21	78	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	22	79	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	22	80	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	22	81	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	23	82	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	23	83	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	23	84	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	24	85	Untuk AI apa saja prompt ini?	Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.	6a4b66af610ab61a0076a00f
2	24	86	Bisa dipakai untuk klien?	Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.	6a4b66af610ab61a0076a010
3	24	87	Apakah update gratis?	Ya, semua update prompt baru akan dikirim ke email pembeli.	6a4b66af610ab61a0076a011
1	25	88	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	25	89	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	25	90	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	26	91	Apakah ini akun Midjourney?	Ini adalah bundle akses + panduan + prompt template. Detail akses diberikan setelah pembelian.	6a4b66af610ab61a0076a002
2	26	92	Untuk siapa produk ini?	Cocok untuk desainer, content creator, marketer, dan siapa saja yang butuh gambar AI berkualitas tinggi.	6a4b66af610ab61a0076a003
3	26	93	Apakah prompt bisa diedit?	Ya, semua prompt template bisa dimodifikasi sesuai kebutuhan Anda.	6a4b66af610ab61a0076a004
1	27	94	Apa bedanya Claude Pro dan ChatGPT Plus?	Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.	6a4b66af610ab61a00769ffb
2	27	95	Berapa lama garansi akun?	Garansi 30 hari penggantian jika akun bermasalah.	6a4b66af610ab61a00769ffc
3	27	96	Bisa upload file?	Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.	6a4b66af610ab61a00769ffd
1	28	97	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	28	98	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	28	99	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	29	100	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	29	101	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	29	102	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	30	103	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	30	104	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	30	105	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	31	106	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	31	107	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	31	108	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	32	109	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	32	110	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	32	111	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	33	112	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	33	113	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	33	114	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	34	115	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	34	116	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	34	117	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	35	118	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	35	119	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	35	120	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	36	121	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	36	122	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	36	123	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	37	124	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	37	125	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	37	126	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	38	127	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	38	128	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	38	129	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	39	130	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.	6a4b66af610ab61a0076a008
2	39	131	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.	6a4b66af610ab61a0076a009
3	39	132	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.	6a4b66af610ab61a0076a00a
1	40	133	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.	6a4b66af610ab61a00769ff5
2	40	134	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.	6a4b66af610ab61a00769ff6
3	40	135	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.	6a4b66af610ab61a00769ff7
1	41	136	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	41	137	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	41	138	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	42	139	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	42	140	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	42	141	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	43	142	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	43	143	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	43	144	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	44	145	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	44	146	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	44	147	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
1	45	148	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.	6a4b66af610ab61a0076a016
2	45	149	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.	6a4b66af610ab61a0076a017
3	45	150	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.	6a4b66af610ab61a0076a018
\.


--
-- Data for Name: _variants_v; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._variants_v (id, parent_id, version_title, version_product_id, version_inventory, version_price_in_u_s_d_enabled, version_price_in_u_s_d, version_updated_at, version_created_at, version_deleted_at, version__status, created_at, updated_at, latest, autosave, version_price_in_i_d_r_enabled, version_price_in_i_d_r) FROM stdin;
\.


--
-- Data for Name: _variants_v_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._variants_v_rels (id, "order", parent_id, path, variant_options_id) FROM stdin;
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, customer_id, title, first_name, last_name, company, address_line1, address_line2, city, state, postal_code, country, phone, updated_at, created_at) FROM stdin;
1	\N	Ms.	DIAN	NURWAHID	Citra Digital Hotel	Salam, Tohkuning RT02 RW11, Tohkuning, Karangpandan	Jl.mojogedang-karangpandan	Karanganyar	Jawa Tengah	57791	HU	+6289514094736	2026-07-06 21:46:34.943+07	2026-07-06 21:46:34.943+07
2	2	\N	Demo	Customer		Jl. Sudirman No. 1		Jakarta		10110	MY		2026-07-07 19:32:27.222+07	2026-07-07 19:32:27.222+07
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, secret, customer_id, purchased_at, subtotal, currency, updated_at, created_at) FROM stdin;
13	\N	1	\N	0	IDR	2026-07-13 18:55:15.835+07	2026-07-13 18:52:51.776+07
2	c3588b281c431d59f31271100eaebeb78a6578c2	\N	\N	0	IDR	2026-07-07 19:33:30.111+07	2026-07-07 19:26:40.359+07
3	e8e96848cca6ab8d78469e2c0991b0f8b6f481db	\N	\N	249000	IDR	2026-07-08 10:24:50.601+07	2026-07-08 10:24:50.599+07
4	\N	2	\N	0	IDR	2026-07-09 00:11:38.031+07	2026-07-08 17:46:13.865+07
5	9555b2d1450c785e4f920b14f18629a5dd4a42c5	\N	\N	99000	IDR	2026-07-09 12:50:39.43+07	2026-07-09 12:41:03.79+07
1	\N	1	\N	37.24	USD	2026-07-09 21:33:41.911+07	2026-07-06 15:30:49.115+07
6	\N	4	\N	417000	IDR	2026-07-09 22:05:01.101+07	2026-07-09 21:40:22.206+07
7	b2e0eea7a50d6c5ada0fe7fd0df149ddcaa2f85e	\N	\N	931	USD	2026-07-09 22:33:20.143+07	2026-07-09 22:33:20.142+07
8	\N	1	\N	387000	IDR	2026-07-10 19:31:08.199+07	2026-07-10 18:08:12.781+07
9	\N	1	\N	149000	IDR	2026-07-12 16:47:05.072+07	2026-07-12 16:47:05.069+07
10	\N	1	\N	99000	IDR	2026-07-12 19:15:42.078+07	2026-07-12 18:29:00.034+07
11	\N	5	\N	0	IDR	2026-07-12 20:25:00.156+07	2026-07-12 19:50:54.347+07
12	a0e90aba33f0a811c0a656f35691bc7b3aa95f7c	\N	\N	200000	IDR	2026-07-13 01:54:48.81+07	2026-07-13 01:38:42.07+07
\.


--
-- Data for Name: carts_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts_items (_order, _parent_id, id, product_id, variant_id, quantity) FROM stdin;
1	10	6a53856dfefff8487c7da564	5	\N	1
1	12	6a53e2f847cc482810e5be69	7	\N	1
1	3	6a4dc302bc1883390434ff9d	7	\N	1
1	5	6a4f36af3d6f8817743e0c10	5	\N	1
1	1	6a4f775511c49d390c3a5869	2	\N	4
1	6	6a4fb823fc851e57100377c8	3	\N	3
1	7	6a4fbf3ffc851e57100377c9	2	\N	1
1	8	6a50d29c1c4b6636909b3c0f	5	\N	1
2	8	6a50e1f843995723506000d4	3	\N	1
3	8	6a50e60c43995723506000d5	2	\N	1
1	9	6a53629859a23c0e28e8203a	2	\N	1
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, title, generate_slug, slug, updated_at, created_at) FROM stdin;
1	AI Account	f	ai-account	2026-07-06 15:26:23.139+07	2026-07-06 15:26:23.137+07
2	AI Prompt Pack	f	ai-prompt-pack	2026-07-06 15:26:23.159+07	2026-07-06 15:26:23.159+07
3	AI Workflow	f	ai-workflow	2026-07-06 15:26:23.171+07	2026-07-06 15:26:23.171+07
4	AI Toolkit	f	ai-toolkit	2026-07-06 15:26:23.182+07	2026-07-06 15:26:23.182+07
\.


--
-- Data for Name: checkout_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.checkout_sessions (id, session_id, customer_id, status, expires_at, reservation_id, cart_id, currency, payment_method, payment_data, order_id, updated_at, created_at, active_key) FROM stdin;
1	8582823a-4f7f-4d55-8c09-34a905f76f6b	1	cancelled	2026-07-12 17:54:42.937+07	8582823a-4f7f-4d55-8c09-34a905f76f6b	9	IDR	pakasir	\N	\N	2026-07-12 17:44:51.337+07	2026-07-12 17:44:42.949+07	\N
2	cce5f148-9f89-4d68-828b-fcc9d74e36ff	1	expired	2026-07-12 17:54:59.922+07	cce5f148-9f89-4d68-828b-fcc9d74e36ff	9	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783853112362", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783853112362", "paymentMethod": "pakasir", "discountAmount": 0}	\N	2026-07-12 17:55:00.98+07	2026-07-12 17:44:59.928+07	\N
3	b5393c89-40b3-4465-8eea-7b28b059ed22	1	cancelled	2026-07-12 18:27:31.902+07	b5393c89-40b3-4465-8eea-7b28b059ed22	9	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783855061157", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783855061157", "paymentMethod": "pakasir", "discountAmount": 0}	\N	2026-07-12 18:26:44.646+07	2026-07-12 18:17:31.906+07	\N
4	24f1a219-5868-43f6-94e1-c6e2736c268f	1	cancelled	2026-07-12 18:36:46.602+07	24f1a219-5868-43f6-94e1-c6e2736c268f	9	IDR	pakasir	\N	\N	2026-07-12 18:26:49.923+07	2026-07-12 18:26:46.604+07	\N
5	622d4253-8966-4641-a813-ec7af9ead022	1	completed	2026-07-12 18:39:03.158+07	622d4253-8966-4641-a813-ec7af9ead022	10	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783855743463", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783855743463", "paymentMethod": "pakasir", "discountAmount": 0}	13	2026-07-12 18:29:28.152+07	2026-07-12 18:29:03.16+07	\N
6	88672fdc-00f5-4ee7-8d6c-e67e908e3b99	1	completed	2026-07-12 18:55:18.916+07	88672fdc-00f5-4ee7-8d6c-e67e908e3b99	10	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783856733977", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783856733977", "paymentMethod": "pakasir", "discountAmount": 0}	14	2026-07-12 18:45:51.187+07	2026-07-12 18:45:18.92+07	\N
7	5c989d12-79ad-4722-bebc-e80a307791da	1	cancelled	2026-07-12 18:58:06.974+07	5c989d12-79ad-4722-bebc-e80a307791da	10	IDR	pakasir	\N	\N	2026-07-12 18:48:10.906+07	2026-07-12 18:48:06.976+07	\N
8	4ec329fc-b13d-4d0d-9549-cff9b085c2ed	1	completed	2026-07-12 18:58:42.238+07	4ec329fc-b13d-4d0d-9549-cff9b085c2ed	10	IDR	pakasir	{"amount": 99000, "message": "Payment initiated successfully", "orderID": "INV1783856922739", "subtotal": 99000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783856922739", "paymentMethod": "pakasir", "discountAmount": 0}	15	2026-07-12 18:48:53.852+07	2026-07-12 18:48:42.243+07	\N
9	bfa5f619-e8f0-4d70-8d0a-2ff51d049e37	1	completed	2026-07-12 19:03:08.887+07	bfa5f619-e8f0-4d70-8d0a-2ff51d049e37	10	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783857192985", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783857192985", "paymentMethod": "pakasir", "discountAmount": 0}	16	2026-07-12 18:53:31.837+07	2026-07-12 18:53:08.893+07	\N
10	ea00ca27-e86b-4a81-b066-1fab8862f695	1	completed	2026-07-12 19:20:22.843+07	ea00ca27-e86b-4a81-b066-1fab8862f695	10	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783858223454", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783858223454", "paymentMethod": "pakasir", "discountAmount": 0}	17	2026-07-12 19:10:32.774+07	2026-07-12 19:10:22.848+07	\N
11	d4299ff5-1be1-46bb-9713-f9f6ec2981b2	1	expired	2026-07-12 19:25:53.585+07	d4299ff5-1be1-46bb-9713-f9f6ec2981b2	10	IDR	pakasir	{"amount": 99000, "message": "Payment initiated successfully", "orderID": "INV1783858567082", "subtotal": 99000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783858567082", "paymentMethod": "pakasir", "discountAmount": 0}	\N	2026-07-12 19:26:15.44+07	2026-07-12 19:15:53.589+07	\N
12	be833d56-cf83-4070-9761-9a5076d0239b	5	completed	2026-07-12 20:01:08.502+07	be833d56-cf83-4070-9761-9a5076d0239b	11	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783860689411", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783860689411", "paymentMethod": "pakasir", "discountAmount": 0}	18	2026-07-12 19:52:01.064+07	2026-07-12 19:51:08.506+07	\N
13	d4929f10-62d2-4b7d-9c3d-3136ccbd7267	5	completed	2026-07-12 20:05:51.03+07	d4929f10-62d2-4b7d-9c3d-3136ccbd7267	11	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783860971239", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783860971239", "paymentMethod": "pakasir", "discountAmount": 0}	19	2026-07-12 19:56:33.489+07	2026-07-12 19:55:51.034+07	\N
14	62998584-c1b0-49e0-821e-e954a54cb17d	5	completed	2026-07-12 20:11:19.224+07	62998584-c1b0-49e0-821e-e954a54cb17d	11	IDR	pakasir	{"amount": 99000, "message": "Payment initiated successfully", "orderID": "INV1783861285972", "subtotal": 99000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783861285972", "paymentMethod": "pakasir", "discountAmount": 0}	20	2026-07-12 20:01:45.298+07	2026-07-12 20:01:19.23+07	\N
15	e16cb542-ed56-447e-8318-1c253dc64f49	5	completed	2026-07-12 20:16:43.586+07	e16cb542-ed56-447e-8318-1c253dc64f49	11	IDR	pakasir	{"amount": 149000, "message": "Payment initiated successfully", "orderID": "INV1783861611343", "subtotal": 149000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783861611343", "paymentMethod": "pakasir", "discountAmount": 0}	21	2026-07-12 20:07:14.358+07	2026-07-12 20:06:43.593+07	\N
16	7dff9a59-8ba8-4e9a-95ae-cfe6b437a6d9	5	cancelled	2026-07-12 20:20:32.561+07	7dff9a59-8ba8-4e9a-95ae-cfe6b437a6d9	11	IDR	pakasir	{"amount": 99000, "message": "Payment initiated successfully", "orderID": "INV1783861844290", "subtotal": 99000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783861844290", "paymentMethod": "pakasir", "discountAmount": 0}	\N	2026-07-12 20:19:30.787+07	2026-07-12 20:10:32.566+07	\N
17	8467abf2-e1b8-4224-85cf-05df6e7062b5	5	completed	2026-07-12 20:31:47.214+07	8467abf2-e1b8-4224-85cf-05df6e7062b5	11	IDR	pakasir	{"amount": 248000, "message": "Payment initiated successfully", "orderID": "INV1783862542567", "subtotal": 248000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783862542567", "paymentMethod": "pakasir", "discountAmount": 0}	22	2026-07-12 20:24:58.268+07	2026-07-12 20:21:47.22+07	\N
18	f3a50c36-3ab2-4c7f-9ef2-6f3f8258baff	1	completed	2026-07-13 19:04:08.364+07	f3a50c36-3ab2-4c7f-9ef2-6f3f8258baff	13	IDR	pakasir	{"amount": 200000, "message": "Payment initiated successfully", "orderID": "INV1783943660594", "subtotal": 200000, "voucherCode": null, "clientSecret": "pakasir_secret_INV1783943660594", "paymentMethod": "pakasir", "discountAmount": 0}	23	2026-07-13 18:54:52.883+07	2026-07-13 18:54:08.376+07	\N
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, code, discount_type, amount, usage_limit, used_count, starts_at, expires_at, status, updated_at, created_at, title, description, benefit_summary, code_mode, code_prefix, minimum_spend, per_user_limit, ttl_hours, send_whats_app_blast, whats_app_blast_sent_at, whats_app_blast_recipient_count) FROM stdin;
\.


--
-- Data for Name: coupons_allowed_tiers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons_allowed_tiers ("order", parent_id, value, id) FROM stdin;
\.


--
-- Data for Name: digital_assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.digital_assets (id, product_id, file_id, file_name, file_size, version, changelog, protected, status, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: digital_stock_units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.digital_stock_units (id, unit_code, product_id, variant, status, delivery_type, label, account_email, account_username, account_password, login_url, reference_code, content, file_id, reservation_id, customer_id, order_id, assigned_at, notes, updated_at, created_at) FROM stdin;
1	DSTK-8514AC080F98	7	\N	archived	credentials	Endpoint Slot 1	slot1@example.com	slot1	U2FsdGVkX1/5EMO+ez+k0qZrtb9VCiQN0pjCDKwAvkY=	https://example.com/login	TEST-001	U2FsdGVkX19ewGHm8/AvSEVssjJJlyBTCE16yBZgGJUSHxevu3UWIFShBrBveGwN	\N	\N	\N	\N	\N	Codex reduce test	2026-07-13 01:15:50.785+07	2026-07-13 01:12:40.846+07
2	DSTK-99A989CC02CC	7	\N	assigned	credentials	akun 1	kanadenjaka@gmail.com	kana	U2FsdGVkX18qqte1m/wz4shOseRKfTtpHUeg56WZse8=	https://www.netflix.com/account/membership	\N	U2FsdGVkX1+hAeuXoT3AMIwiUuGFa9UhpnFh/1a8FgI=	\N	order:23	1	23	2026-07-13 18:54:46.855+07	\N	2026-07-13 18:54:46.911+07	2026-07-13 01:29:16.92+07
\.


--
-- Data for Name: download_access; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.download_access (id, customer_id, product_id, order_id, asset_id, status, max_downloads, download_count, expires_at, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: download_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.download_logs (id, customer_id, product_id, asset_id, order_id, ip, user_agent, downloaded_at, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_templates (id, name, subject, body, type, status, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: footer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.footer (id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: footer_nav_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.footer_nav_items (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label) FROM stdin;
\.


--
-- Data for Name: footer_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.footer_rels (id, "order", parent_id, path, pages_id) FROM stdin;
\.


--
-- Data for Name: form_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_submissions (id, form_id, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: form_submissions_submission_data; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.form_submissions_submission_data (_order, _parent_id, id, field, value) FROM stdin;
\.


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms (id, title, submit_button_label, confirmation_type, confirmation_message, redirect_url, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: forms_blocks_checkbox; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_checkbox (_order, _parent_id, _path, id, name, label, width, required, default_value, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_country; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_country (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_email; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_email (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_message (_order, _parent_id, _path, id, message, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_number; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_number (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_select; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_select (_order, _parent_id, _path, id, name, label, width, default_value, placeholder, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_select_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_select_options (_order, _parent_id, id, label, value) FROM stdin;
\.


--
-- Data for Name: forms_blocks_state; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_state (_order, _parent_id, _path, id, name, label, width, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_text; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_text (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_blocks_textarea; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_blocks_textarea (_order, _parent_id, _path, id, name, label, width, default_value, required, block_name) FROM stdin;
\.


--
-- Data for Name: forms_emails; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forms_emails (_order, _parent_id, id, email_to, cc, bcc, reply_to, email_from, subject, message) FROM stdin;
\.


--
-- Data for Name: header; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.header (id, updated_at, created_at) FROM stdin;
1	2026-07-06 15:28:18.007+07	2026-07-06 15:28:18.007+07
\.


--
-- Data for Name: header_nav_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.header_nav_items (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label) FROM stdin;
1	1	6a4b6722bb7dea47f87b2dbf	custom	\N	/	Beranda
2	1	6a4b6722bb7dea47f87b2dc0	custom	\N	/shop	Produk
3	1	6a4b6722bb7dea47f87b2dc1	custom	\N	/account	Akun Saya
\.


--
-- Data for Name: header_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.header_rels (id, "order", parent_id, path, pages_id) FROM stdin;
\.


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.licenses (id, customer_id, product_id, order_id, license_key, status, max_activations, activation_count, expires_at, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, alt, caption, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, uploaded_by_id, is_support_attachment) FROM stdin;
1	ChatGPT Plus Account - AI Assistant Premium	\N	2026-07-06 15:26:23.215+07	2026-07-06 15:26:23.215+07	/api/media/file/chatgpt-plus.svg	\N	chatgpt-plus.svg	image/svg+xml	868	1200	900	\N	\N	\N	f
2	Claude Pro Account - Anthropic AI Assistant	\N	2026-07-06 15:26:23.236+07	2026-07-06 15:26:23.236+07	/api/media/file/claude-pro.svg	\N	claude-pro.svg	image/svg+xml	866	1200	900	\N	\N	\N	f
3	Midjourney Access - AI Image Generation	\N	2026-07-06 15:26:23.248+07	2026-07-06 15:26:23.248+07	/api/media/file/midjourney.svg	\N	midjourney.svg	image/svg+xml	866	1200	900	\N	\N	\N	f
4	GitHub Copilot - AI Pair Programming	\N	2026-07-06 15:26:23.26+07	2026-07-06 15:26:23.26+07	/api/media/file/github-copilot.svg	\N	github-copilot.svg	image/svg+xml	870	1200	900	\N	\N	\N	f
5	AI Prompt Pack Premium - 1000+ Prompts	\N	2026-07-06 15:26:23.273+07	2026-07-06 15:26:23.273+07	/api/media/file/prompt-pack.svg	\N	prompt-pack.svg	image/svg+xml	867	1200	900	\N	\N	\N	f
6	AI Workflow Automation Kit	\N	2026-07-06 15:26:23.286+07	2026-07-06 15:26:23.285+07	/api/media/file/workflow-kit.svg	\N	workflow-kit.svg	image/svg+xml	868	1200	900	\N	\N	\N	f
7	ChatGPT Plus Account - AI Assistant Premium	\N	2026-07-06 15:28:17.603+07	2026-07-06 15:28:17.602+07	/api/media/file/chatgpt-plus-1.svg	\N	chatgpt-plus-1.svg	image/svg+xml	868	1200	900	\N	\N	\N	f
8	Claude Pro Account - Anthropic AI Assistant	\N	2026-07-06 15:28:17.627+07	2026-07-06 15:28:17.627+07	/api/media/file/claude-pro-1.svg	\N	claude-pro-1.svg	image/svg+xml	866	1200	900	\N	\N	\N	f
9	Midjourney Access - AI Image Generation	\N	2026-07-06 15:28:17.642+07	2026-07-06 15:28:17.642+07	/api/media/file/midjourney-1.svg	\N	midjourney-1.svg	image/svg+xml	866	1200	900	\N	\N	\N	f
10	GitHub Copilot - AI Pair Programming	\N	2026-07-06 15:28:17.658+07	2026-07-06 15:28:17.658+07	/api/media/file/github-copilot-1.svg	\N	github-copilot-1.svg	image/svg+xml	870	1200	900	\N	\N	\N	f
11	AI Prompt Pack Premium - 1000+ Prompts	\N	2026-07-06 15:28:17.673+07	2026-07-06 15:28:17.672+07	/api/media/file/prompt-pack-1.svg	\N	prompt-pack-1.svg	image/svg+xml	867	1200	900	\N	\N	\N	f
12	AI Workflow Automation Kit	\N	2026-07-06 15:28:17.687+07	2026-07-06 15:28:17.687+07	/api/media/file/workflow-kit-1.svg	\N	workflow-kit-1.svg	image/svg+xml	868	1200	900	\N	\N	\N	f
13	gpt promo	\N	2026-07-06 20:20:35.766+07	2026-07-06 20:20:35.765+07	/api/media/file/ChatGPT%20Image%206%20Jul%202026%2C%2020.19.57.png	\N	ChatGPT Image 6 Jul 2026, 20.19.57.png	image/png	1528589	2172	724	50	50	\N	f
14	mahasiswa	\N	2026-07-06 20:25:11.122+07	2026-07-06 20:25:11.122+07	/api/media/file/hs-3.png	\N	hs-3.png	image/png	2036116	1122	1402	50	50	\N	f
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, shipping_address_title, shipping_address_first_name, shipping_address_last_name, shipping_address_company, shipping_address_address_line1, shipping_address_address_line2, shipping_address_city, shipping_address_state, shipping_address_postal_code, shipping_address_country, shipping_address_phone, customer_id, customer_email, status, amount, currency, access_token, updated_at, created_at, voucher_id, voucher_code, subtotal_before_discount, discount_amount, member_tier_snapshot, points_earned, payment_reference) FROM stdin;
1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	diannurwahid1@gmail.com	completed	\N	USD	3bbb9002-f216-46d2-84f9-2e2397847c71	2026-07-07 18:38:16.286+07	2026-07-07 18:38:16.284+07	\N	\N	\N	\N	\N	0	\N
2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	diannurwahid1@gmail.com	completed	\N	USD	c5067c19-65a7-4bec-9925-4248bbc3110d	2026-07-07 18:38:46.093+07	2026-07-07 18:38:46.093+07	\N	\N	\N	\N	\N	0	\N
3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	diannurwahid1@gmail.com	completed	237000	USD	9e7668e0-ba94-4c8e-a269-73086b3e96d2	2026-07-07 18:59:21.864+07	2026-07-07 18:59:21.863+07	\N	\N	\N	\N	\N	0	\N
6	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	customer@example.com	completed	447000	IDR	a2caf658-5f30-42e8-9105-26c326c71cc5	2026-07-07 19:33:29.85+07	2026-07-07 19:33:29.671+07	\N	\N	\N	\N	\N	0	\N
7	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	amkdana@gmail.com	completed	139000	IDR	dfdf1e59-d986-45e6-b7ac-6738c1a0de6f	2026-07-09 12:45:31.154+07	2026-07-09 12:45:30.884+07	\N	\N	139000	0	bronze	0	\N
8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	diannurwahid1@gmail.com	completed	149000	IDR	8401d5ae-5f8a-49a5-bce2-7f35b2497948	2026-07-09 18:07:04.937+07	2026-07-09 18:07:04.574+07	\N	\N	149000	0	bronze	0	\N
9	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	dillacandra114@gmail.com	completed	149000	IDR	fa25d0cc-e745-4fd7-92f1-94e47b79d130	2026-07-09 21:40:57.013+07	2026-07-09 21:40:56.589+07	\N	\N	149000	0	bronze	0	\N
10	\N	Dilla Candra	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	089514094736	4	dillacandra114@gmail.com	completed	149000	IDR	335a03c7-c3e7-4e72-b933-9ba168458bb8	2026-07-09 21:51:44.594+07	2026-07-09 21:51:44.078+07	\N	\N	149000	0	bronze	0	\N
11	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	149000	IDR	da704e66-2866-4683-b111-8027e13cf185	2026-07-12 17:46:35.739+07	2026-07-12 17:46:35.187+07	\N	\N	149000	0	silver	149	INV1783853112362
13	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	149000	IDR	8430407a-ffc3-4c1a-ae4f-bdec3ec3db39	2026-07-12 18:29:27.25+07	2026-07-12 18:29:26.999+07	\N	\N	149000	0	silver	149	INV1783855743463
14	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	149000	IDR	0c7bbf36-d87e-4d4e-bcd1-bcdd16a5ae58	2026-07-12 18:45:50.339+07	2026-07-12 18:45:50.112+07	\N	\N	149000	0	silver	149	INV1783856733977
15	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	99000	IDR	5d02da38-e52a-4c26-aa2e-eded48fc3954	2026-07-12 18:48:53.389+07	2026-07-12 18:48:53.194+07	\N	\N	99000	0	silver	99	INV1783856922739
16	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	149000	IDR	e480ca8c-32b0-470c-b8f6-dce067f2fd62	2026-07-12 18:53:30.77+07	2026-07-12 18:53:30.467+07	\N	\N	149000	0	gold	149	INV1783857192985
17	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	149000	IDR	7c30bb89-3a36-491e-b51e-939be3114f99	2026-07-12 19:10:31.816+07	2026-07-12 19:10:31.574+07	\N	\N	149000	0	gold	149	INV1783858223454
18	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	5	diannur.intern@gmail.com	completed	149000	IDR	15042429-aa4a-4cab-aab6-4af20a58dfea	2026-07-12 19:51:59.686+07	2026-07-12 19:51:59.295+07	\N	\N	149000	0	bronze	149	INV1783860689411
19	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	5	diannur.intern@gmail.com	completed	149000	IDR	c476ecf5-cc20-4040-a066-35fec5ada052	2026-07-12 19:56:32.31+07	2026-07-12 19:56:31.944+07	\N	\N	149000	0	bronze	149	INV1783860971239
20	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	5	diannur.intern@gmail.com	completed	99000	IDR	a2e20a48-d1c1-49e2-8a0e-2a0f46ee3bcf	2026-07-12 20:01:44.042+07	2026-07-12 20:01:43.722+07	\N	\N	99000	0	silver	99	INV1783861285972
21	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	5	diannur.intern@gmail.com	completed	149000	IDR	06993a4e-71e0-49f7-9272-84410b03ea1d	2026-07-12 20:07:13.194+07	2026-07-12 20:07:12.736+07	\N	\N	149000	0	silver	149	INV1783861611343
22	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	5	diannur.intern@gmail.com	completed	248000	IDR	94c02291-569c-41a8-abd7-65f56a66c945	2026-07-12 20:24:54.092+07	2026-07-12 20:24:53.309+07	\N	\N	248000	0	silver	248	INV1783862542567
23	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	1	diannurwahid1@gmail.com	completed	200000	IDR	e248621e-1957-45bf-b4dd-4c5ca7f2165c	2026-07-13 18:54:48.163+07	2026-07-13 18:54:46.494+07	\N	\N	200000	0	gold	200	INV1783943660594
\.


--
-- Data for Name: orders_digital_deliveries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders_digital_deliveries (_order, _parent_id, id, product_id, product_title, variant, variant_title, quantity) FROM stdin;
1	23	6a54d20739809b204cd2832a	7	AI Workflow Automation Kit	\N	\N	1
\.


--
-- Data for Name: orders_digital_deliveries_units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders_digital_deliveries_units (_order, _parent_id, id, unit_code, delivery_type, label, account_email, account_username, account_password, login_url, reference_code, content, file_id) FROM stdin;
1	6a54d20739809b204cd2832a	6a54d20739809b204cd28329	DSTK-99A989CC02CC	credentials	akun 1	kanadenjaka@gmail.com	kana	ascdass	https://www.netflix.com/account/membership	\N	ca	\N
\.


--
-- Data for Name: orders_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders_items (_order, _parent_id, id, product_id, variant_id, quantity) FROM stdin;
1	3	6a4b67b9cc2000372c287ca6	6	\N	3
1	6	6a4cf0801caa324038bc4cd7	2	\N	3
1	7	6a4f346f3d6f8817743e0c0f	3	\N	1
1	8	6a4f775511c49d390c3a5869	2	\N	1
1	9	6a4fb2d518cefa3cf8af40c3	2	\N	1
1	10	6a4fb5493d2fb3612002199d	2	\N	1
1	11	6a53629859a23c0e28e8203a	2	\N	1
1	13	6a537a7b59a23c0e28e8203b	2	\N	1
1	14	6a537e4b59a23c0e28e8203c	2	\N	1
1	15	6a537eef59a23c0e28e8203d	5	\N	1
1	16	6a538020fefff8487c7da562	2	\N	1
1	17	6a53842bfefff8487c7da563	2	\N	1
1	18	6a538daefefff8487c7da565	2	\N	1
1	19	6a538ec1fefff8487c7da566	2	\N	1
1	20	6a539017fefff8487c7da567	5	\N	1
1	21	6a539157fefff8487c7da568	2	\N	1
1	22	6a539240fefff8487c7da569	5	\N	1
2	22	6a5392a0fefff8487c7da56a	2	\N	1
1	23	6a54d18f39809b204cd28328	7	\N	1
\.


--
-- Data for Name: orders_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders_rels (id, "order", parent_id, path, transactions_id) FROM stdin;
1	1	6	transactions	4
2	1	7	transactions	5
3	1	8	transactions	6
4	1	9	transactions	7
5	1	10	transactions	8
6	1	11	transactions	9
7	1	13	transactions	10
8	1	14	transactions	11
9	1	15	transactions	12
10	1	16	transactions	13
11	1	17	transactions	14
12	1	18	transactions	15
13	1	19	transactions	16
14	1	20	transactions	17
15	1	21	transactions	18
16	1	22	transactions	19
17	1	23	transactions	20
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages (id, title, published_on, hero_type, hero_rich_text, hero_media_id, meta_title, meta_image_id, meta_description, generate_slug, slug, updated_at, created_at, _status) FROM stdin;
1	\N	\N	flashSale	\N	\N	\N	\N	\N	t	\N	2026-07-08 20:06:03.022+07	2026-07-08 20:06:03.02+07	draft
\.


--
-- Data for Name: pages_blocks_archive; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_archive (_order, _parent_id, _path, id, intro_content, populate_by, relation_to, "limit", block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_banner; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_banner (_order, _parent_id, _path, id, style, content, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_carousel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_carousel (_order, _parent_id, _path, id, populate_by, relation_to, "limit", populated_docs_total, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_content (_order, _parent_id, _path, id, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_content_columns (_order, _parent_id, id, size, rich_text, enable_link, link_type, link_new_tab, link_url, link_label, link_appearance) FROM stdin;
\.


--
-- Data for Name: pages_blocks_cta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_cta (_order, _parent_id, _path, id, rich_text, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_cta_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance) FROM stdin;
\.


--
-- Data for Name: pages_blocks_form_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_form_block (_order, _parent_id, _path, id, form_id, enable_intro, intro_content, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_media_block (_order, _parent_id, _path, id, media_id, block_name) FROM stdin;
\.


--
-- Data for Name: pages_blocks_three_item_grid; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_blocks_three_item_grid (_order, _parent_id, _path, id, block_name) FROM stdin;
\.


--
-- Data for Name: pages_hero_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_hero_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance) FROM stdin;
\.


--
-- Data for Name: pages_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pages_rels (id, "order", parent_id, path, pages_id, categories_id, products_id) FROM stdin;
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, pages_id, categories_id, media_id, forms_id, form_submissions_id, addresses_id, variants_id, variant_types_id, variant_options_id, products_id, carts_id, orders_id, transactions_id, digital_assets_id, download_access_id, download_logs_id, licenses_id, payment_transactions_id, coupons_id, support_tickets_id, support_messages_id, email_templates_id, promo_banners_id, testimonials_id, stock_reservations_id, stock_ledger_id, checkout_sessions_id, digital_stock_units_id) FROM stdin;
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
2	20260712_234500_digital_stock_units	1	2026-07-13 00:14:13.037+07	2026-07-13 00:14:13.037+07
1	dev	-1	2026-07-13 23:26:25.538+07	2026-07-06 13:13:35.015+07
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
2	global-footer	{"editViewType": "default"}	2026-07-06 14:19:42.657+07	2026-07-06 14:19:42.666+07
4	collection-categories	{}	2026-07-06 14:19:47.561+07	2026-07-06 14:19:47.561+07
6	collection-forms	{}	2026-07-06 14:19:51.244+07	2026-07-06 14:19:51.244+07
7	collection-form-submissions	{}	2026-07-06 14:19:53.027+07	2026-07-06 14:19:53.026+07
9	collection-carts	{}	2026-07-06 14:20:05.104+07	2026-07-06 14:20:05.104+07
10	collection-transactions	{"limit": 10}	2026-07-06 14:37:37.605+07	2026-07-06 14:29:39.943+07
11	collection-digital-assets	{}	2026-07-06 14:57:07.687+07	2026-07-06 14:57:07.687+07
1	nav	{"groups": {"Users": {"open": true}, "Content": {"open": true}, "Globals": {"open": true}, "Support": {"open": true}, "Commerce": {"open": true}, "Settings": {"open": false}, "Ecommerce": {"open": true}, "Marketing": {"open": true}, "Digital Commerce": {"open": true}}}	2026-07-12 22:07:28.726+07	2026-07-06 14:19:39.216+07
12	collection-download-access	{"limit": 10, "editViewType": "default"}	2026-07-06 15:01:18.917+07	2026-07-06 14:57:11.149+07
33	products-digitalStockUnits	{"limit": 10, "columns": [{"active": true, "accessor": "unitCode"}, {"active": true, "accessor": "status"}, {"active": true, "accessor": "deliveryType"}, {"active": true, "accessor": "accountEmail"}, {"active": true, "accessor": "order"}]}	2026-07-13 00:55:31.481+07	2026-07-13 00:55:31.48+07
13	users-orders	{"limit": 10, "columns": [{"active": true, "accessor": "id"}, {"active": true, "accessor": "createdAt"}, {"active": true, "accessor": "total"}, {"active": true, "accessor": "currency"}, {"active": true, "accessor": "items"}]}	2026-07-06 17:36:35.698+07	2026-07-06 17:36:35.695+07
14	users-cart	{"limit": 10, "columns": [{"active": true, "accessor": "id"}, {"active": true, "accessor": "createdAt"}, {"active": true, "accessor": "total"}, {"active": true, "accessor": "currency"}, {"active": true, "accessor": "items"}]}	2026-07-06 17:36:36.118+07	2026-07-06 17:36:36.118+07
15	users-addresses	{"limit": 10, "columns": [{"active": true, "accessor": "id"}]}	2026-07-06 17:36:36.287+07	2026-07-06 17:36:36.287+07
28	collection-products-7	{"fields": {"_index-2": {"tabIndex": 1}}}	2026-07-13 00:55:47.136+07	2026-07-08 18:42:37.543+07
16	collection-promo-banners	{"editViewType": "default"}	2026-07-06 20:15:52.088+07	2026-07-06 20:15:48.233+07
5	collection-media	{"editViewType": "default"}	2026-07-06 20:20:09.431+07	2026-07-06 14:19:49.496+07
34	global-whatsapp-blast-test	{"editViewType": "default"}	2026-07-13 20:08:28.023+07	2026-07-13 20:08:28.026+07
17	collection-testimonials	{"editViewType": "default"}	2026-07-06 20:24:15.261+07	2026-07-06 20:24:09.388+07
23	collection-stock-ledger	{"limit": 10}	2026-07-13 20:14:06.822+07	2026-07-08 07:25:52.628+07
18	collection-orders	{"editViewType": "default"}	2026-07-07 19:40:23.279+07	2026-07-07 19:40:17.062+07
19	collection-payment-transactions	{}	2026-07-07 19:41:14.568+07	2026-07-07 19:41:14.568+07
20	collection-coupons	{}	2026-07-07 19:41:18.125+07	2026-07-07 19:41:18.125+07
35	collection-digital-stock-units	{}	2026-07-13 20:14:37.387+07	2026-07-13 20:14:37.387+07
36	collection-download-logs	{"limit": 10}	2026-07-13 20:17:19.494+07	2026-07-13 20:15:37.785+07
8	collection-products	{"limit": 10, "editViewType": "default"}	2026-07-07 19:54:09.045+07	2026-07-06 14:19:54.994+07
21	collection-stock-reservations	{"limit": 10}	2026-07-07 20:27:16.328+07	2026-07-07 20:24:01.523+07
22	collection-stock-reservations	{"limit": 10}	2026-07-07 20:27:17.454+07	2026-07-07 20:27:17.453+07
25	collection-support-messages	{"limit": 10, "editViewType": "default"}	2026-07-08 16:46:51.032+07	2026-07-08 16:44:40.582+07
24	collection-support-tickets	{"limit": 10, "editViewType": "default"}	2026-07-08 17:03:52.411+07	2026-07-08 16:44:33.58+07
26	products-stockReservations	{"limit": 10, "columns": [{"active": true, "accessor": "reservationId"}, {"active": true, "accessor": "quantity"}, {"active": true, "accessor": "status"}, {"active": true, "accessor": "expiresAt"}]}	2026-07-08 18:42:26.333+07	2026-07-08 18:42:26.326+07
27	products-stockHistory	{"limit": 10, "columns": [{"active": true, "accessor": "createdAt"}, {"active": true, "accessor": "type"}, {"active": true, "accessor": "qty"}, {"active": true, "accessor": "stockBefore"}, {"active": true, "accessor": "stockAfter"}, {"active": true, "accessor": "referenceId"}]}	2026-07-08 18:42:26.841+07	2026-07-08 18:42:26.84+07
29	products-digitalAssets	{"limit": 10, "columns": [{"active": true, "accessor": "fileName"}, {"active": true, "accessor": "version"}, {"active": true, "accessor": "status"}, {"active": true, "accessor": "protected"}]}	2026-07-08 18:42:46.017+07	2026-07-08 18:42:46.017+07
30	global-stock-adjustment	{"editViewType": "default"}	2026-07-08 19:05:02.545+07	2026-07-08 19:05:02.56+07
31	global-header	{"editViewType": "default"}	2026-07-08 20:03:59.785+07	2026-07-08 20:03:59.795+07
3	collection-pages	{"limit": 10, "editViewType": "default"}	2026-07-08 20:06:07.575+07	2026-07-06 14:19:44.93+07
32	collection-pages-1	{"fields": {"_index-2": {"tabIndex": 0}}}	2026-07-08 20:06:24.845+07	2026-07-08 20:06:21.344+07
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
3	\N	2	user	1
5	\N	4	user	1
7	\N	6	user	1
8	\N	7	user	1
103	\N	1	user	1
11	\N	9	user	1
105	\N	33	user	1
14	\N	10	user	1
15	\N	10	user	1
16	\N	10	user	1
17	\N	11	user	1
106	\N	28	user	1
107	\N	34	user	1
20	\N	12	user	1
108	\N	23	user	1
22	\N	13	user	1
23	\N	14	user	1
24	\N	15	user	1
109	\N	35	user	1
26	\N	16	user	1
27	\N	5	user	1
29	\N	17	user	1
111	\N	36	user	1
31	\N	18	user	1
32	\N	19	user	1
33	\N	20	user	1
43	\N	8	user	1
48	\N	21	user	1
49	\N	22	user	1
56	\N	25	user	1
65	\N	24	user	1
66	\N	24	user	1
67	\N	24	user	1
68	\N	24	user	1
69	\N	26	user	1
70	\N	27	user	1
73	\N	29	user	1
75	\N	30	user	1
85	\N	31	user	1
88	\N	3	user	1
92	\N	32	user	1
\.


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_transactions (id, order_id, customer_id, provider, provider_transaction_id, amount, currency, status, raw_payload, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, title, description, inventory, enable_variants, price_in_u_s_d_enabled, price_in_u_s_d, meta_title, meta_image_id, meta_description, generate_slug, slug, updated_at, created_at, deleted_at, _status, short_description, product_type, license_type, version, update_policy, refund_policy, is_featured, badge, price_in_i_d_r_enabled, price_in_i_d_r, promo_is_flash_sale, promo_flash_sale_end_date, promo_discount_percent, digital_fulfillment_mode) FROM stdin;
1	\N	\N	0	\N	\N	\N	\N	\N	\N	t	\N	2026-07-06 14:19:57.305+07	2026-07-06 14:19:57.304+07	\N	draft	\N	digital	standard	1.0.0	\N	\N	f	\N	\N	\N	f	\N	\N	standard
2	ChatGPT Plus Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Dapatkan akses ChatGPT Plus langsung aktif tanpa ribet. Cocok untuk mahasiswa, profesional, developer, dan content creator yang butuh akses AI tercepat dan paling lengkap dari OpenAI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	27	\N	t	931	ChatGPT Plus Account | Citra Commerce	1	Beli akun ChatGPT Plus dengan akses GPT-4o, DALL·E, browsing, dan plugin premium. Garansi 30 hari.	f	chatgpt-plus-account	2026-07-12 20:24:57.498+07	2026-07-06 15:26:23.387+07	\N	published	Akun ChatGPT Plus aktif dengan akses GPT-4o, GPT-4, DALL·E, browsing, dan plugin premium. Garansi 30 hari penggantian.	digital	personal	1.0	\N	\N	t	best_seller	t	149000	f	\N	\N	standard
6	AI Prompt Pack Premium	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Hentikan kehabisan ide prompt! Dengan 1000+ prompt terkurasi ini, Anda bisa langsung menggunakan AI untuk kebutuhan bisnis, marketing, coding, copywriting, analisis data, dan banyak lagi. Setiap prompt sudah diuji dan dioptimasi untuk hasil terbaik.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	0	\N	t	494	AI Prompt Pack Premium | Citra Commerce	5	1000+ prompt terkurasi untuk ChatGPT, Claude, dan Gemini. Kategori bisnis, marketing, coding, copywriting.	f	ai-prompt-pack-premium	2026-07-09 22:25:47.776+07	2026-07-06 15:26:23.685+07	\N	published	Koleksi 1000+ prompt terkurasi untuk ChatGPT, Claude, Gemini. Untuk bisnis, marketing, coding, copywriting, dan education.	prompt_pack	commercial	3.0	\N	\N	t	best_seller	t	79000	f	\N	\N	standard
4	Midjourney Access Bundle	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Midjourney adalah tool AI image generation terbaik saat ini. Dengan bundle ini, Anda mendapat akses dan panduan lengkap mulai dari dasar hingga teknik advanced seperti style mixing, multi-prompt, dan parameter tuning. Termasuk 500+ prompt template untuk berbagai use case.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	100	\N	t	1244	Midjourney Access Bundle | Citra Commerce	3	Akses Midjourney + panduan lengkap + 500+ prompt template untuk AI image generation profesional.	f	midjourney-access-bundle	2026-07-09 22:25:48.33+07	2026-07-06 15:26:23.582+07	\N	published	Akses Midjourney untuk generate gambar AI berkualitas tinggi. Termasuk panduan lengkap dan 500+ prompt siap pakai.	digital	standard	2.0	\N	\N	t	best_seller	t	199000	f	\N	\N	standard
3	Claude Pro Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Claude Pro dari Anthropic adalah AI assistant terbaik untuk analisis dokumen panjang, coding, dan penulisan profesional. Dengan akun Pro, Anda mendapat limit penggunaan 5x lebih banyak, akses prioritas, dan fitur terbaru lebih awal.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	39	\N	t	869	Claude Pro Account | Citra Commerce	2	Beli akun Claude Pro dengan akses Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih besar.	f	claude-pro-account	2026-07-09 22:25:48.638+07	2026-07-06 15:26:23.526+07	\N	published	Akun Claude Pro dengan akses penuh ke Claude 3.5 Sonnet, Opus, dan Haiku. Limit 5x lebih banyak dari gratis.	digital	personal	1.0	\N	\N	t	new	t	139000	f	\N	\N	standard
5	GitHub Copilot Account	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "GitHub Copilot adalah AI pair programmer terbaik dari GitHub dan OpenAI. Dengan akun ini, Anda mendapat akses Copilot langsung di editor favorit Anda. Cocok untuk developer yang ingin coding 10x lebih cepat dengan bantuan AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	24	\N	t	619	GitHub Copilot Account | Citra Commerce	4	Beli akun GitHub Copilot Individual. Autocomplete AI untuk VS Code, JetBrains, dan Neovim.	f	github-copilot-account	2026-07-12 20:24:57.471+07	2026-07-06 15:26:23.636+07	\N	published	Akun GitHub Copilot Individual untuk autocomplete kode AI di VS Code, JetBrains, dan Neovim. Langsung aktif.	digital	personal	1.0	\N	\N	f	new	t	99000	f	\N	\N	standard
7	AI Workflow Automation Kit	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Otomasi bisnis Anda dengan kekuatan AI. Bundle ini berisi 50+ template workflow siap import untuk platform n8n, Make (Integromat), dan Zapier. Mulai dari email automation, social media posting, data processing, customer support, hingga content generation — semua sudah terintegrasi AI.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": "ltr", "textStyle": "", "textFormat": 0}], "direction": "ltr"}}	-1	\N	t	1250	AI Workflow Automation Kit | Citra Commerce	6	50+ template workflow otomasi AI untuk n8n, Make, Zapier. Email, social media, data processing, dan lainnya.	f	ai-workflow-automation-kit	2026-07-13 18:54:51.003+07	2026-07-06 15:26:23.735+07	\N	published	Bundle 50+ template workflow otomasi berbasis AI untuk n8n, Make, dan Zapier. Hemat ratusan jam kerja.	digital	commercial	1.5	\N	\N	f	new	t	200000	t	2026-07-08 00:00:00+07	20	per_unit_stock
\.


--
-- Data for Name: products_blocks_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_blocks_content (_order, _parent_id, _path, id, block_name) FROM stdin;
\.


--
-- Data for Name: products_blocks_content_columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_blocks_content_columns (_order, _parent_id, id, size, rich_text, enable_link, link_type, link_new_tab, link_url, link_label, link_appearance) FROM stdin;
\.


--
-- Data for Name: products_blocks_cta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_blocks_cta (_order, _parent_id, _path, id, rich_text, block_name) FROM stdin;
\.


--
-- Data for Name: products_blocks_cta_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_blocks_cta_links (_order, _parent_id, id, link_type, link_new_tab, link_url, link_label, link_appearance) FROM stdin;
\.


--
-- Data for Name: products_blocks_media_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_blocks_media_block (_order, _parent_id, _path, id, media_id, block_name) FROM stdin;
\.


--
-- Data for Name: products_gallery; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_gallery (_order, _parent_id, id, image_id, variant_option_id) FROM stdin;
1	6	6a4b66af610ab61a0076a00b	5	\N
1	4	6a4b66af610ab61a00769ffe	3	\N
1	3	6a4b66af610ab61a00769ff8	2	\N
1	5	6a4b66af610ab61a0076a005	4	\N
1	2	6a4b66af610ab61a00769ff2	1	\N
1	7	6a4b66af610ab61a0076a012	6	\N
\.


--
-- Data for Name: products_included_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_included_files (_order, _parent_id, id, label, format, size) FROM stdin;
1	5	6a4b66af610ab61a0076a006	Panduan Setup Copilot (PDF)	PDF	1.5 MB
2	5	6a4b66af610ab61a0076a007	Tips Copilot untuk Developer	PDF	1 MB
1	2	6a4b66af610ab61a00769ff3	Panduan Aktivasi Akun (PDF)	PDF	2 MB
2	2	6a4b66af610ab61a00769ff4	Tips Penggunaan ChatGPT Plus	PDF	1.5 MB
1	7	6a4b66af610ab61a0076a013	50+ Workflow Templates (JSON)	JSON	2 MB
2	7	6a4b66af610ab61a0076a014	Panduan Setup & Import (PDF)	PDF	4 MB
3	7	6a4b66af610ab61a0076a015	Video Tutorial (MP4)	MP4	500 MB
1	6	6a4b66af610ab61a0076a00c	1000+ Prompt Pack (Notion Template)	Notion	5 MB
2	6	6a4b66af610ab61a0076a00d	PDF Version Lengkap	PDF	8 MB
3	6	6a4b66af610ab61a0076a00e	Bonus: Prompt Engineering Guide	PDF	3 MB
1	4	6a4b66af610ab61a00769fff	Panduan Midjourney Lengkap (PDF)	PDF	5 MB
2	4	6a4b66af610ab61a0076a000	500+ Prompt Template (PDF)	PDF	3 MB
3	4	6a4b66af610ab61a0076a001	Cheat Sheet Parameter (PDF)	PDF	1 MB
1	3	6a4b66af610ab61a00769ff9	Panduan Aktivasi Claude Pro (PDF)	PDF	1.8 MB
2	3	6a4b66af610ab61a00769ffa	Prompt Template Claude untuk Bisnis	PDF	2.2 MB
\.


--
-- Data for Name: products_product_f_a_q; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_product_f_a_q (_order, _parent_id, id, question, answer) FROM stdin;
1	5	6a4b66af610ab61a0076a008	Bekerja di editor apa saja?	Support VS Code, JetBrains (IntelliJ, PyCharm, dll), Neovim, dan Visual Studio.
2	5	6a4b66af610ab61a0076a009	Berapa lama masa aktif?	1 tahun penuh. Diperpanjang otomatis jika diperlukan.
3	5	6a4b66af610ab61a0076a00a	Bisa untuk bahasa pemrograman apa?	Mendukung hampir semua bahasa: Python, JavaScript, TypeScript, Go, Rust, Java, C++, dan banyak lagi.
1	2	6a4b66af610ab61a00769ff5	Apakah akun langsung aktif?	Ya, akun langsung aktif setelah pembayaran terverifikasi. Detail login dikirim via email.
2	2	6a4b66af610ab61a00769ff6	Berapa lama garansi?	Garansi 30 hari penggantian jika terjadi masalah pada akun.
3	2	6a4b66af610ab61a00769ff7	Bisakah dipakai di mobile?	Ya, bisa digunakan di browser desktop, mobile, dan aplikasi ChatGPT.
1	7	6a4b66af610ab61a0076a016	Platform apa saja yang didukung?	n8n (self-hosted & cloud), Make (Integromat), dan Zapier.
2	7	6a4b66af610ab61a0076a017	Apakah butuh skill coding?	Tidak. Semua workflow sudah siap import dan dikonfigurasi via UI. Tinggal sesuaikan API key dan data.
3	7	6a4b66af610ab61a0076a018	Bisa request workflow custom?	Ya, ada layanan kustomisasi workflow dengan biaya tambahan.
1	6	6a4b66af610ab61a0076a00f	Untuk AI apa saja prompt ini?	Kompatibel dengan ChatGPT (GPT-4o, GPT-4), Claude, Gemini, dan AI chatbot lainnya.
2	6	6a4b66af610ab61a0076a010	Bisa dipakai untuk klien?	Ya, license commercial memperbolehkan penggunaan untuk project klien dan bisnis.
3	6	6a4b66af610ab61a0076a011	Apakah update gratis?	Ya, semua update prompt baru akan dikirim ke email pembeli.
1	4	6a4b66af610ab61a0076a002	Apakah ini akun Midjourney?	Ini adalah bundle akses + panduan + prompt template. Detail akses diberikan setelah pembelian.
2	4	6a4b66af610ab61a0076a003	Untuk siapa produk ini?	Cocok untuk desainer, content creator, marketer, dan siapa saja yang butuh gambar AI berkualitas tinggi.
3	4	6a4b66af610ab61a0076a004	Apakah prompt bisa diedit?	Ya, semua prompt template bisa dimodifikasi sesuai kebutuhan Anda.
1	3	6a4b66af610ab61a00769ffb	Apa bedanya Claude Pro dan ChatGPT Plus?	Claude Pro unggul di analisis dokumen panjang, konteks 200K token, dan keamanan jawaban. Cocok untuk penelitian dan coding.
2	3	6a4b66af610ab61a00769ffc	Berapa lama garansi akun?	Garansi 30 hari penggantian jika akun bermasalah.
3	3	6a4b66af610ab61a00769ffd	Bisa upload file?	Ya, bisa upload dokumen, gambar, dan file untuk dianalisis oleh Claude.
\.


--
-- Data for Name: products_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_rels (id, "order", parent_id, path, pages_id, variant_types_id, products_id, categories_id) FROM stdin;
26	1	6	categories	\N	\N	\N	2
28	1	4	categories	\N	\N	\N	1
29	2	4	categories	\N	\N	\N	4
30	1	3	categories	\N	\N	\N	1
42	1	5	categories	\N	\N	\N	1
43	1	2	categories	\N	\N	\N	1
52	1	7	relatedProducts	\N	\N	2	\N
53	1	7	categories	\N	\N	\N	3
\.


--
-- Data for Name: promo_banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.promo_banners (id, title, image_id, link, status, priority, start_date, end_date, updated_at, created_at) FROM stdin;
1	Banner 1	13	\N	published	0	2026-07-06 18:30:00+07	2026-08-01 00:00:00+07	2026-07-06 20:20:55.224+07	2026-07-06 20:20:55.224+07
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, store_name, logo_id, favicon_id, primary_color, support_email, payment_config, email_config, storage_config, legal_pages_terms_page_id, legal_pages_privacy_page_id, legal_pages_refund_page_id, updated_at, created_at, trust_badges_total_users, trust_badges_satisfaction_rate, trust_badges_support_availability, commerce_enable_u_s_d) FROM stdin;
\.


--
-- Data for Name: settings_trust_badges_partner_logos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings_trust_badges_partner_logos (_order, _parent_id, id, logo_id, name) FROM stdin;
\.


--
-- Data for Name: stock_adjustment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_adjustment (id, updated_at, created_at) FROM stdin;
1	2026-07-13 01:28:50.958+07	2026-07-08 19:19:45.628+07
\.


--
-- Data for Name: stock_ledger; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_ledger (id, product_id, variant, type, qty, stock_before, stock_after, reference_id, order_id, customer_id, performed_by_id, notes, updated_at, created_at) FROM stdin;
1	7	\N	adjust	-50	50	0	\N	\N	\N	1	Manual adjustment	2026-07-08 19:23:15.88+07	2026-07-08 19:23:15.88+07
2	6	\N	adjust	-999	999	0	\N	\N	\N	1	Manual adjustment	2026-07-08 19:23:34.454+07	2026-07-08 19:23:34.454+07
3	3	\N	reserved	-1	40	39	5:3:base	\N	\N	\N	Stok dipesan sementara (cart: 5)	2026-07-09 12:45:18.957+07	2026-07-09 12:45:18.957+07
4	3	\N	out	-1	40	39	5:3:base	7	\N	\N	Stok keluar (terjual) — order #7	2026-07-09 12:45:32.355+07	2026-07-09 12:45:32.354+07
5	2	\N	reserved	-1	47	46	1:2:base	\N	1	\N	Stok dipesan sementara (cart: 1)	2026-07-09 18:02:02.13+07	2026-07-09 18:02:02.129+07
6	2	\N	out	-1	47	46	1:2:base	8	1	\N	Stok keluar (terjual) — order #8	2026-07-09 18:07:05.811+07	2026-07-09 18:07:05.811+07
7	2	\N	reserved	-1	45	44	1:2:base	\N	1	\N	Stok dipesan sementara (cart: 1)	2026-07-09 18:47:57.708+07	2026-07-09 18:47:57.708+07
8	2	\N	released	1	44	45	1:2:base	\N	\N	\N	User cancelled payment	2026-07-09 18:49:47.953+07	2026-07-09 18:49:47.953+07
9	2	\N	reserved	-1	45	44	1:2:base	\N	1	\N	Stok dipesan sementara (cart: 1)	2026-07-09 19:30:39.675+07	2026-07-09 19:30:39.675+07
10	2	\N	released	1	44	45	1:2:base	\N	\N	\N	User cancelled payment	2026-07-09 19:42:38.265+07	2026-07-09 19:42:38.265+07
11	2	\N	reserved	-1	46	45	6:2:base	\N	4	\N	Stok dipesan sementara (cart: 6)	2026-07-09 21:40:42.645+07	2026-07-09 21:40:42.645+07
12	2	\N	out	-1	46	45	6:2:base	9	4	\N	Stok keluar (terjual) — order #9	2026-07-09 21:40:58.527+07	2026-07-09 21:40:58.526+07
13	2	\N	reserved	-1	44	43	6:2:base	\N	4	\N	Stok dipesan sementara (cart: 6)	2026-07-09 21:51:22.916+07	2026-07-09 21:51:22.915+07
14	2	\N	released	1	43	44	6:2:base	\N	\N	\N	User cancelled payment	2026-07-09 21:51:41.557+07	2026-07-09 21:51:41.556+07
15	3	\N	reserved	-1	39	38	6:3:base	\N	4	\N	Stok dipesan sementara (cart: 6)	2026-07-09 22:05:41.417+07	2026-07-09 22:05:41.417+07
16	5	\N	reserved	-1	30	29	8:5:base	\N	1	\N	Stok dipesan sementara (cart: 8)	2026-07-10 18:08:33.676+07	2026-07-10 18:08:33.675+07
17	3	\N	reserved	-1	39	38	8:3:base	\N	1	\N	Stok dipesan sementara (cart: 8)	2026-07-10 19:14:00.013+07	2026-07-10 19:14:00.012+07
18	3	\N	released	1	38	39	8:3:base	\N	\N	\N	User cancelled payment	2026-07-10 19:14:19.27+07	2026-07-10 19:14:19.27+07
19	2	\N	reserved	-1	45	44	8:2:base	\N	1	\N	Stok dipesan sementara (cart: 8)	2026-07-10 19:31:23.971+07	2026-07-10 19:31:23.971+07
20	5	\N	released	1	29	30	8:5:base	\N	\N	\N	User cancelled payment	2026-07-10 19:34:39.811+07	2026-07-10 19:34:39.81+07
21	2	\N	released	1	44	45	8:2:base	\N	\N	\N	User cancelled payment	2026-07-10 19:34:40.373+07	2026-07-10 19:34:40.372+07
22	2	\N	reserved	-1	45	44	9:2:base	\N	1	\N	Stok dipesan sementara (cart: 9)	2026-07-12 16:49:22.828+07	2026-07-12 16:49:22.828+07
23	2	\N	released	1	44	45	9:2:base	\N	\N	\N	User cancelled payment	2026-07-12 16:50:35.996+07	2026-07-12 16:50:35.995+07
24	2	\N	reserved	-1	45	44	cce5f148-9f89-4d68-828b-fcc9d74e36ff:2:base	\N	1	\N	Stok dipesan sementara (cart: 9)	2026-07-12 17:45:00.468+07	2026-07-12 17:45:00.467+07
25	2	\N	out	-1	45	44	cce5f148-9f89-4d68-828b-fcc9d74e36ff:2:base	11	1	\N	Stok keluar (terjual) — order #11	2026-07-12 17:46:37.447+07	2026-07-12 17:46:37.446+07
26	2	\N	reserved	-1	43	42	b5393c89-40b3-4465-8eea-7b28b059ed22:2:base	\N	1	\N	Stok dipesan sementara (cart: 9)	2026-07-12 18:17:36.526+07	2026-07-12 18:17:36.524+07
27	2	\N	released	1	42	43	b5393c89-40b3-4465-8eea-7b28b059ed22:2:base	\N	\N	\N	Customer cancelled checkout	2026-07-12 18:26:44.617+07	2026-07-12 18:26:44.617+07
28	2	\N	reserved	-1	43	42	622d4253-8966-4641-a813-ec7af9ead022:2:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 18:29:03.369+07	2026-07-12 18:29:03.369+07
29	2	\N	out	-1	43	42	622d4253-8966-4641-a813-ec7af9ead022:2:base	13	1	\N	Stok keluar (terjual) — order #13	2026-07-12 18:29:27.907+07	2026-07-12 18:29:27.907+07
30	2	\N	reserved	-1	41	40	88672fdc-00f5-4ee7-8d6c-e67e908e3b99:2:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 18:45:33.678+07	2026-07-12 18:45:33.678+07
31	2	\N	out	-1	41	40	88672fdc-00f5-4ee7-8d6c-e67e908e3b99:2:base	14	1	\N	Stok keluar (terjual) — order #14	2026-07-12 18:45:50.979+07	2026-07-12 18:45:50.979+07
32	5	\N	reserved	-1	30	29	4ec329fc-b13d-4d0d-9549-cff9b085c2ed:5:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 18:48:42.605+07	2026-07-12 18:48:42.605+07
33	5	\N	out	-1	30	29	4ec329fc-b13d-4d0d-9549-cff9b085c2ed:5:base	15	1	\N	Stok keluar (terjual) — order #15	2026-07-12 18:48:53.721+07	2026-07-12 18:48:53.721+07
34	2	\N	reserved	-1	39	38	bfa5f619-e8f0-4d70-8d0a-2ff51d049e37:2:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 18:53:12.633+07	2026-07-12 18:53:12.633+07
35	2	\N	out	-1	39	38	bfa5f619-e8f0-4d70-8d0a-2ff51d049e37:2:base	16	1	\N	Stok keluar (terjual) — order #16	2026-07-12 18:53:31.528+07	2026-07-12 18:53:31.528+07
36	2	\N	reserved	-1	37	36	ea00ca27-e86b-4a81-b066-1fab8862f695:2:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 19:10:23.284+07	2026-07-12 19:10:23.284+07
37	2	\N	out	-1	37	36	ea00ca27-e86b-4a81-b066-1fab8862f695:2:base	17	1	\N	Stok keluar (terjual) — order #17	2026-07-12 19:10:32.527+07	2026-07-12 19:10:32.527+07
38	5	\N	reserved	-1	28	27	d4299ff5-1be1-46bb-9713-f9f6ec2981b2:5:base	\N	1	\N	Stok dipesan sementara (cart: 10)	2026-07-12 19:16:06.495+07	2026-07-12 19:16:06.495+07
39	5	\N	released	1	27	28	d4299ff5-1be1-46bb-9713-f9f6ec2981b2:5:base	\N	\N	\N	Checkout expired	2026-07-12 19:26:15.324+07	2026-07-12 19:26:15.324+07
40	5	\N	released	1	27	28	d4299ff5-1be1-46bb-9713-f9f6ec2981b2:5:base	\N	\N	\N	Checkout expired	2026-07-12 19:26:15.351+07	2026-07-12 19:26:15.351+07
41	5	\N	released	1	27	28	d4299ff5-1be1-46bb-9713-f9f6ec2981b2:5:base	\N	\N	\N	Checkout expired	2026-07-12 19:26:15.4+07	2026-07-12 19:26:15.4+07
42	2	\N	reserved	-1	35	34	be833d56-cf83-4070-9761-9a5076d0239b:2:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 19:51:29.067+07	2026-07-12 19:51:29.066+07
43	2	\N	out	-1	35	34	be833d56-cf83-4070-9761-9a5076d0239b:2:base	18	5	\N	Stok keluar (terjual) — order #18	2026-07-12 19:52:00.788+07	2026-07-12 19:52:00.788+07
44	2	\N	reserved	-1	33	32	d4929f10-62d2-4b7d-9c3d-3136ccbd7267:2:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 19:56:09.65+07	2026-07-12 19:56:09.65+07
45	2	\N	out	-1	33	32	d4929f10-62d2-4b7d-9c3d-3136ccbd7267:2:base	19	5	\N	Stok keluar (terjual) — order #19	2026-07-12 19:56:33.207+07	2026-07-12 19:56:33.206+07
46	5	\N	reserved	-1	28	27	62998584-c1b0-49e0-821e-e954a54cb17d:5:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 20:01:25.693+07	2026-07-12 20:01:25.693+07
47	5	\N	out	-1	28	27	62998584-c1b0-49e0-821e-e954a54cb17d:5:base	20	5	\N	Stok keluar (terjual) — order #20	2026-07-12 20:01:45.019+07	2026-07-12 20:01:45.019+07
48	2	\N	reserved	-1	31	30	e16cb542-ed56-447e-8318-1c253dc64f49:2:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 20:06:51.027+07	2026-07-12 20:06:51.027+07
49	2	\N	out	-1	31	30	e16cb542-ed56-447e-8318-1c253dc64f49:2:base	21	5	\N	Stok keluar (terjual) — order #21	2026-07-12 20:07:14.007+07	2026-07-12 20:07:14.007+07
50	5	\N	reserved	-1	26	25	7dff9a59-8ba8-4e9a-95ae-cfe6b437a6d9:5:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 20:10:43.948+07	2026-07-12 20:10:43.948+07
51	5	\N	released	1	25	26	7dff9a59-8ba8-4e9a-95ae-cfe6b437a6d9:5:base	\N	\N	\N	Customer cancelled checkout	2026-07-12 20:19:30.726+07	2026-07-12 20:19:30.726+07
52	5	\N	reserved	-1	26	25	8467abf2-e1b8-4224-85cf-05df6e7062b5:5:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 20:22:03.046+07	2026-07-12 20:22:03.046+07
53	2	\N	reserved	-1	29	28	8467abf2-e1b8-4224-85cf-05df6e7062b5:2:base	\N	5	\N	Stok dipesan sementara (cart: 11)	2026-07-12 20:22:03.362+07	2026-07-12 20:22:03.361+07
54	5	\N	out	-1	26	25	8467abf2-e1b8-4224-85cf-05df6e7062b5:5:base	22	5	\N	Stok keluar (terjual) — order #22	2026-07-12 20:24:56.249+07	2026-07-12 20:24:56.248+07
55	2	\N	out	-1	29	28	8467abf2-e1b8-4224-85cf-05df6e7062b5:2:base	22	5	\N	Stok keluar (terjual) — order #22	2026-07-12 20:24:57.35+07	2026-07-12 20:24:57.349+07
56	7	\N	in	1	0	1	\N	\N	\N	1	Codex endpoint test	2026-07-13 01:12:40.68+07	2026-07-13 01:12:40.68+07
57	7	\N	adjust	-1	1	0	\N	\N	\N	1	Codex reduce test	2026-07-13 01:15:50.526+07	2026-07-13 01:15:50.525+07
58	7	\N	in	1	0	1	\N	\N	\N	1	Manual restock	2026-07-13 01:29:16.825+07	2026-07-13 01:29:16.825+07
59	7	\N	reserved	-1	1	0	f3a50c36-3ab2-4c7f-9ef2-6f3f8258baff:7:base	\N	1	\N	Stok dipesan sementara (cart: 13)	2026-07-13 18:54:15.659+07	2026-07-13 18:54:15.659+07
60	7	\N	out	-1	1	0	f3a50c36-3ab2-4c7f-9ef2-6f3f8258baff:7:base	23	1	\N	Stok keluar (terjual) — order #23	2026-07-13 18:54:50.774+07	2026-07-13 18:54:50.773+07
\.


--
-- Data for Name: stock_reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_reservations (id, reservation_id, product_id, variant, quantity, status, expires_at, order_id, customer_id, cart_id, notes, updated_at, created_at) FROM stdin;
1	5:3:base	3	\N	1	confirmed	2026-07-09 12:55:18.861+07	7	\N	5	\N	2026-07-09 12:45:31.428+07	2026-07-09 12:45:18.866+07
2	1:2:base	2	\N	1	confirmed	2026-07-09 18:12:02.006+07	8	1	1	\N	2026-07-09 18:07:05.145+07	2026-07-09 18:02:02.013+07
3	1:2:base	2	\N	1	released	2026-07-09 18:57:57.523+07	\N	1	1	User cancelled payment	2026-07-09 18:49:47.808+07	2026-07-09 18:47:57.533+07
4	1:2:base	2	\N	1	released	2026-07-09 19:40:39.54+07	\N	1	1	User cancelled payment	2026-07-09 19:42:37.198+07	2026-07-09 19:30:39.549+07
5	6:2:base	2	\N	1	confirmed	2026-07-09 21:50:42.53+07	9	4	6	\N	2026-07-09 21:40:57.655+07	2026-07-09 21:40:42.535+07
6	6:2:base	2	\N	1	released	2026-07-09 22:01:22.665+07	\N	4	6	User cancelled payment	2026-07-09 21:51:41.271+07	2026-07-09 21:51:22.68+07
7	6:3:base	3	\N	1	pending	2026-07-09 22:15:41.123+07	\N	4	6	\N	2026-07-09 22:05:41.152+07	2026-07-09 22:05:41.144+07
9	8:3:base	3	\N	1	released	2026-07-10 19:23:59.891+07	\N	1	8	User cancelled payment	2026-07-10 19:14:18.507+07	2026-07-10 19:13:59.9+07
8	8:5:base	5	\N	1	released	2026-07-10 18:18:33.589+07	\N	1	8	User cancelled payment	2026-07-10 19:34:38.809+07	2026-07-10 18:08:33.6+07
10	8:2:base	2	\N	1	released	2026-07-10 19:41:23.668+07	\N	1	8	User cancelled payment	2026-07-10 19:34:40.028+07	2026-07-10 19:31:23.68+07
11	9:2:base	2	\N	1	released	2026-07-12 16:59:22.294+07	\N	1	9	User cancelled payment	2026-07-12 16:50:34.84+07	2026-07-12 16:49:22.326+07
12	cce5f148-9f89-4d68-828b-fcc9d74e36ff:2:base	2	\N	1	confirmed	2026-07-12 17:55:00.304+07	11	1	9	\N	2026-07-12 17:46:36.38+07	2026-07-12 17:45:00.312+07
13	b5393c89-40b3-4465-8eea-7b28b059ed22:2:base	2	\N	1	released	2026-07-12 18:27:36.282+07	\N	1	9	Customer cancelled checkout	2026-07-12 18:26:44.492+07	2026-07-12 18:17:36.289+07
14	622d4253-8966-4641-a813-ec7af9ead022:2:base	2	\N	1	confirmed	2026-07-12 18:39:03.323+07	13	1	10	\N	2026-07-12 18:29:27.432+07	2026-07-12 18:29:03.325+07
15	88672fdc-00f5-4ee7-8d6c-e67e908e3b99:2:base	2	\N	1	confirmed	2026-07-12 18:55:33.555+07	14	1	10	\N	2026-07-12 18:45:50.504+07	2026-07-12 18:45:33.559+07
16	4ec329fc-b13d-4d0d-9549-cff9b085c2ed:5:base	5	\N	1	confirmed	2026-07-12 18:58:42.534+07	15	1	10	\N	2026-07-12 18:48:53.516+07	2026-07-12 18:48:42.537+07
17	bfa5f619-e8f0-4d70-8d0a-2ff51d049e37:2:base	2	\N	1	confirmed	2026-07-12 19:03:12.501+07	16	1	10	\N	2026-07-12 18:53:31.025+07	2026-07-12 18:53:12.506+07
18	ea00ca27-e86b-4a81-b066-1fab8862f695:2:base	2	\N	1	confirmed	2026-07-12 19:20:23.166+07	17	1	10	\N	2026-07-12 19:10:32.065+07	2026-07-12 19:10:23.169+07
19	d4299ff5-1be1-46bb-9713-f9f6ec2981b2:5:base	5	\N	1	released	2026-07-12 19:26:06.186+07	\N	1	10	Checkout expired	2026-07-12 19:26:15.243+07	2026-07-12 19:16:06.196+07
20	be833d56-cf83-4070-9761-9a5076d0239b:2:base	2	\N	1	confirmed	2026-07-12 20:01:28.807+07	18	5	11	\N	2026-07-12 19:52:00.019+07	2026-07-12 19:51:28.817+07
21	d4929f10-62d2-4b7d-9c3d-3136ccbd7267:2:base	2	\N	1	confirmed	2026-07-12 20:06:09.105+07	19	5	11	\N	2026-07-12 19:56:32.593+07	2026-07-12 19:56:09.113+07
22	62998584-c1b0-49e0-821e-e954a54cb17d:5:base	5	\N	1	confirmed	2026-07-12 20:11:25.484+07	20	5	11	\N	2026-07-12 20:01:44.269+07	2026-07-12 20:01:25.493+07
23	e16cb542-ed56-447e-8318-1c253dc64f49:2:base	2	\N	1	confirmed	2026-07-12 20:16:50.895+07	21	5	11	\N	2026-07-12 20:07:13.5+07	2026-07-12 20:06:50.9+07
24	7dff9a59-8ba8-4e9a-95ae-cfe6b437a6d9:5:base	5	\N	1	released	2026-07-12 20:20:43.815+07	\N	5	11	Customer cancelled checkout	2026-07-12 20:19:30.429+07	2026-07-12 20:10:43.821+07
25	8467abf2-e1b8-4224-85cf-05df6e7062b5:5:base	5	\N	1	confirmed	2026-07-12 20:32:02.833+07	22	5	11	\N	2026-07-12 20:24:54.492+07	2026-07-12 20:22:02.843+07
26	8467abf2-e1b8-4224-85cf-05df6e7062b5:2:base	2	\N	1	confirmed	2026-07-12 20:32:03.176+07	22	5	11	\N	2026-07-12 20:24:56.727+07	2026-07-12 20:22:03.183+07
27	f3a50c36-3ab2-4c7f-9ef2-6f3f8258baff:7:base	7	\N	1	confirmed	2026-07-13 19:04:15.436+07	23	1	13	\N	2026-07-13 18:54:49.055+07	2026-07-13 18:54:15.444+07
\.


--
-- Data for Name: support_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_messages (id, ticket_id, sender_id, sender_role, message, is_internal_note, updated_at, created_at) FROM stdin;
1	1	2	customer	kenapa ya error akunnya	f	2026-07-08 15:17:25.522+07	2026-07-08 15:17:25.522+07
2	1	2	customer	kenapa gitu ya	f	2026-07-08 15:18:16.69+07	2026-07-08 15:18:16.689+07
3	1	1	admin	gapapa	f	2026-07-08 17:12:37.673+07	2026-07-08 17:12:37.669+07
4	1	1	admin	anjay lu	f	2026-07-08 17:12:41.746+07	2026-07-08 17:12:41.746+07
5	1	2	customer	tutup tiketna	f	2026-07-09 11:38:39.543+07	2026-07-09 11:38:39.536+07
\.


--
-- Data for Name: support_messages_attachments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_messages_attachments (_order, _parent_id, id, file_id) FROM stdin;
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_tickets (id, ticket_number, customer_id, related_order_id, related_product_id, subject, category, priority, status, assigned_to_id, updated_at, created_at) FROM stdin;
1	TICKET-MRBT1M9F	2	\N	\N	Perihal Dokumen saat pendaftran	general_question	medium	in_progress	\N	2026-07-09 11:38:39.791+07	2026-07-08 15:17:25.495+07
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, name, role, avatar_id, comment_id, comment_en, rating, status, priority, updated_at, created_at) FROM stdin;
1	jaka	Mahasiswa	14	sangat bagus sekali	verry nice	5	published	0	2026-07-06 20:25:29.912+07	2026-07-06 20:25:29.912+07
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, payment_method, billing_address_title, billing_address_first_name, billing_address_last_name, billing_address_company, billing_address_address_line1, billing_address_address_line2, billing_address_city, billing_address_state, billing_address_postal_code, billing_address_country, billing_address_phone, status, customer_id, customer_email, order_id, cart_id, amount, currency, updated_at, created_at, pakasir_pakasir_order_i_d, nowpayments_nowpayments_payment_i_d, nowpayments_pay_currency) FROM stdin;
1	pakasir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	pending	\N	\N	\N	\N	237000	USD	2026-07-07 18:38:09.653+07	2026-07-07 18:38:09.648+07	\N	\N	\N
4	pakasir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	succeeded	2	customer@example.com	6	\N	447000	IDR	2026-07-07 19:33:29.724+07	2026-07-07 19:33:29.723+07	INV1783427591570	\N	\N
5	pakasir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	succeeded	\N	amkdana@gmail.com	7	\N	139000	IDR	2026-07-09 12:45:30.98+07	2026-07-09 12:45:30.979+07	INV1783575919108	\N	\N
6	pakasir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	succeeded	1	diannurwahid1@gmail.com	8	\N	149000	IDR	2026-07-09 18:07:04.792+07	2026-07-09 18:07:04.791+07	INV1783594922304	\N	\N
7	pakasir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	succeeded	4	dillacandra114@gmail.com	9	\N	149000	IDR	2026-07-09 21:40:56.768+07	2026-07-09 21:40:56.765+07	INV1783608042872	\N	\N
8	pakasir	\N	Dilla Candra	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	089514094736	succeeded	4	dillacandra114@gmail.com	10	\N	149000	IDR	2026-07-09 21:51:44.338+07	2026-07-09 21:51:44.336+07	INV1783608683402	\N	\N
9	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	11	\N	149000	IDR	2026-07-12 17:46:35.522+07	2026-07-12 17:46:35.52+07	INV1783853112362	\N	\N
10	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	13	\N	149000	IDR	2026-07-12 18:29:27.155+07	2026-07-12 18:29:27.154+07	INV1783855743463	\N	\N
11	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	14	\N	149000	IDR	2026-07-12 18:45:50.255+07	2026-07-12 18:45:50.255+07	INV1783856733977	\N	\N
12	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	15	\N	99000	IDR	2026-07-12 18:48:53.317+07	2026-07-12 18:48:53.317+07	INV1783856922739	\N	\N
13	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	16	\N	149000	IDR	2026-07-12 18:53:30.652+07	2026-07-12 18:53:30.65+07	INV1783857192985	\N	\N
14	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	17	\N	149000	IDR	2026-07-12 19:10:31.704+07	2026-07-12 19:10:31.703+07	INV1783858223454	\N	\N
15	pakasir	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	5	diannur.intern@gmail.com	18	\N	149000	IDR	2026-07-12 19:51:59.547+07	2026-07-12 19:51:59.546+07	INV1783860689411	\N	\N
16	pakasir	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	5	diannur.intern@gmail.com	19	\N	149000	IDR	2026-07-12 19:56:32.177+07	2026-07-12 19:56:32.175+07	INV1783860971239	\N	\N
17	pakasir	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	5	diannur.intern@gmail.com	20	\N	99000	IDR	2026-07-12 20:01:43.904+07	2026-07-12 20:01:43.902+07	INV1783861285972	\N	\N
18	pakasir	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	5	diannur.intern@gmail.com	21	\N	149000	IDR	2026-07-12 20:07:13.015+07	2026-07-12 20:07:13.014+07	INV1783861611343	\N	\N
19	pakasir	\N	Dian Nur Wahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	5	diannur.intern@gmail.com	22	\N	248000	IDR	2026-07-12 20:24:53.88+07	2026-07-12 20:24:53.878+07	INV1783862542567	\N	\N
20	pakasir	\N	Dian Nurwahid	\N	\N	WhatsApp checkout	\N	Online	\N	-	ID	085198526632	succeeded	1	diannurwahid1@gmail.com	23	\N	200000	IDR	2026-07-13 18:54:47.767+07	2026-07-13 18:54:47.764+07	INV1783943660594	\N	\N
\.


--
-- Data for Name: transactions_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions_items (_order, _parent_id, id, product_id, variant_id, quantity) FROM stdin;
1	1	6a4b67b9cc2000372c287ca6	6	\N	3
1	4	6a4cf0801caa324038bc4cd7	2	\N	3
1	5	6a4f346f3d6f8817743e0c0f	3	\N	1
1	6	6a4f775511c49d390c3a5869	2	\N	1
1	7	6a4fb2d518cefa3cf8af40c3	2	\N	1
1	8	6a4fb5493d2fb3612002199d	2	\N	1
1	9	6a53629859a23c0e28e8203a	2	\N	1
1	10	6a537a7b59a23c0e28e8203b	2	\N	1
1	11	6a537e4b59a23c0e28e8203c	2	\N	1
1	12	6a537eef59a23c0e28e8203d	5	\N	1
1	13	6a538020fefff8487c7da562	2	\N	1
1	14	6a53842bfefff8487c7da563	2	\N	1
1	15	6a538daefefff8487c7da565	2	\N	1
1	16	6a538ec1fefff8487c7da566	2	\N	1
1	17	6a539017fefff8487c7da567	5	\N	1
1	18	6a539157fefff8487c7da568	2	\N	1
1	19	6a539240fefff8487c7da569	5	\N	1
2	19	6a5392a0fefff8487c7da56a	2	\N	1
1	20	6a54d18f39809b204cd28328	7	\N	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until, google_id, avatar_id, status, member_tier, total_spent_i_d_r, member_since, google_avatar_u_r_l, phone, delete_account_requested_at, delete_account_reason, membership_points) FROM stdin;
3	Citra Digital Hotel	2026-07-09 12:33:42.573+07	2026-07-09 12:27:00.782+07	citradigitalhotel@gmail.com	\N	\N	2d707bebe982f1be80df6b65335105789f4241ac84c20e708ca6ac7a119392f9	125ebc1f995ee683a9e85acdc17b3f48b2dfe93e8893c538f416ec55b2200ad650c24f6bab1ecfe97d000d217bbdf1cdf35f28448629cbfddf0e83a93e025716ac3fe2b09ecedaac21c1c50551fd7db03418c9d601fe9192d30de51b7c59691457d984e9148a791902e2e04237f04fa278d00983afd2758deba6cd1faf116a7ad0ddaaedfbd3a04e738ab3c4dcd7ad1c402932071e613bc2c3229e97408eab4f00c35ed57817742fd92c49f367aaa20a15a4a804b1231a07ceba15fe9174b29b7e4a0b17a752c5e9841488b84a01a94ee4b422ba351dc3827d0b551d7eaf6b5a28994c37ce0a86088bb36635d069aff387ac0cb2f5bb8ba314ff2ac12ffba15044ee95aed52ca3135c79990ee98af9f55dee99c0ac2b4f5fdb8e599f0da8b6a184b080f1529c9aaacd350816f95581537f2cda996838a16e8b8088662ff0bea4d0dff6f04770dfdec0c5aa4503982f605dc403bacf21200c258708d322fc70703d66d32c5d41fdfe84315c2ed9c5345d53a5cc602a8ac5665dd949a0051dff3a360fdcb29dac13cd650397b6a8d365577b7317c429c4611cf631dc84e730846ddd8f3cda7cf27b716507cde58becedf2b45df9b8035b65d8144ee76e16edcd459b31ef3d82852352b3525170c11cf03281b4773891c89186de508dc9fb7ed919b28b2a3c4909d9f26e6088783f97ef1ed78bde82dafd10303a0e329ae622ea55	0	\N	113740530007882560118	\N	active	bronze	0	2026-07-09 12:26:59.832+07	https://lh3.googleusercontent.com/a/ACg8ocKTxYIzDC3q0hF8AY7eyLxK8okGVFHMMeh-0BZn1vjJ3Y8GBsQ=s96-c	\N	\N	\N	0
2	Demo Customer	2026-07-06 15:26:24.005+07	2026-07-06 15:26:24.004+07	customer@example.com	\N	\N	64586e1f0236ff2d2ad67eea7eefcf2ba4abb7c098d275dede0aac639e58834b	f12e703bfecb88c7bece9051a61c90d776b9be6150ae978076b273cb50ef7ba8b8dcec0fa3f117fb47a2e2814828e89ae06ce5ca6f3dd2627890ef83a7023172858b0f27b63f02a25350e233ba9feb3d2a084b7741c1123a81c148ebde9d16c0f1ce00390e6a1a6b1461d77141fa0fae83fc22fab2a4d5fa71801e2da8ab073252f57cfcbca0457ba392dd63b12c62eb9f419de6450182cc700fd6886c8f81d5434971d8e1dede28d0577bc169c8a6a2eefd74f1de7d0c02fc39a9276ae1453baeb2f57d11f2b14d8a9b08e7b35d4e98a10307969ff1e95ebc0be4c002956f34ae60da576ff57f948c0622cc9e7275f42619bf25480cef03911dbbe60d65be756715ede74c95bc48481f9d8e17c5707212564073ceb4105159230f6a9c754d47644e3bee1962733882a0860d0b46a029d33f50c55512727c305a9e2ab4d04210528c602c961728cc756fa876fd3bd17806d4b0c46bf089fb4c41edd154e894bcfdb4f52f0d375ebf610fed2097bff2ef4200423054704ef1d3d65d62d7e9e058a34f9497809d438d1ff25ee7cead79a871994ac045e94f5105dcae9058c78714b7a9798664c2ea3cc27aaaf8facad4c3a5b17561f30cc36d8d24e065cf8ddadcd9e447e6ccfc0e1f62ad31aa39b2d6bb029f09f56dd156474950a7e907bc97d3208f43b87fe75fac75c03ca7fb381a79c40cbf3ec796b3ee7cc921cc2d3c41d8	0	\N	\N	\N	active	bronze	0	\N	\N	\N	\N	\N	0
4	Dilla Candra	2026-07-09 21:51:45.01+07	2026-07-09 21:39:52.393+07	dillacandra114@gmail.com	\N	\N	d2d3e04bf7cb03fa11d4034e8bb1272ed77a5967523889ada937bf4050690490	4ea1ce2e81ac6b370baf67a6af57204771e52286776eb36d01def3ba77c6bae978acaf242f2d829df9331e24763b534653ad48b744f21eac976d360d9c016dbbe3c92f4f225664c76b05ff9c70b70e34de552ade62890dcb000d6b75cdf1dccb426bcad56a9a2758617315501924f472f86bd1e2f0aa48c561ced2dfe63cbf4462bba440da3975e33ecb4b78ac9b0b7614fbd2e788abd9792e1800b65506f5a1f5b101cfa58987fedd5927be80af819525e26e6630253f775994fb70febc472b0de1632d2e4b381fe2ce032f62fdfb088a9f81a0c64c910ce3e9fb441cab39591584305a01d54b1daa02cadec16147337e4af7086efca5d86d4b3fbcaa043c47e3c854482c9f66d15065bada5c4579158d92b9ecd5837d592494ce0eee320383e87de8ddc6d12ad40392febfdc5434153da936627821b6ee4b9015e48442dc32406afa2df857dfb09ed41f16c4b8dda7bd56aa4f3a88e4ca31bc0cce2ddb0226fdea767fc393203776cd5fc10d6de3243bfde2d45060575cf1a2a70e956a5dbadc7cca7816500d83f03cd0741ae58a4738b5126beafdc362ac760b912b78189c55a0e04ee893187f9480a2aa522ce1adb21a02c2f2947e739374c11e28773583169fedbca62d09be827a348a4aabf0b653cd704dda53614d0b11e77a46ddce6e31e3448384c564779f50077e14c3c292d957bb02cc2a7f06ab81304035f882ed	0	\N	U2FsdGVkX1/Nh0gtUu1fiGe1uw4UDYXkS792Jlx5M4B3KHYb2+MRR8Ocw4rhLinc	\N	active	silver	298000	2026-07-09 21:39:51.868+07	https://lh3.googleusercontent.com/a/ACg8ocJutOVIMMBmaLF5RSPrditURivEouxe2lhb1WHEjNQvKDl0dw=s96-c	089514094736	\N	\N	0
1	Dian Nurwahid	2026-07-13 18:54:48.822+07	2026-07-06 14:19:33.802+07	diannurwahid1@gmail.com	\N	\N	3c28a0decb3547a42748239fa380ee1191845a4a23e077c0c335dfb45fdd708c	ad57aeb745eca35ee0478d3b84a3365c6ceac0a4543f2b8ffc7912f0b49fd3628a9f831d43d677c2847bc019eef72cd513e9bf5db28861180b8fe9e0b53ed50662454b4bfab54c137a4a2e51420458c54dd0cf3c61eb1835435f83993e6e5217e02db523142ee57d3f611a50428be6c50e332795d7bce40771f5dbb3a4c1206ab81cd66b0a2f4a3036c73bb5595bdcc972aa140387f5e4b613a4e5d102dc27927c82f0e06bccc91c9833ba9ed2f6afdbfa38102f2decd4848a01d19dfaf99398a1117c8bf790a86ea977891672407093ea9d76e5fa2846fd96623a7b43bf5a8a60e312e0eab31f8d1cb3b3baba3209e816fc21bab61cbb0692c757b16cdac3b003ac7102932c8854a8979c510a0abd8985acf7f5476c0c69ac2a9281385cb5699f35470a7b2ad5b96d3d958a2f4b883fe2d8c604d9ad510f090ff4776679cc73e0cf9a8072ec525f077235c0603085c9af5ad192e4d7ddf8f96569ede8a69be040d34922b03802feb80bb6176d36414506bff05655a83cda67821e615f514d39a54c864815d133b38941890e52777285fad208ac93e8a73bf977bb90add7153f851b21d26c74dc2267165c5a0d8cf791dcd011c24552901610f1b83b638ebddc9c9b14803510ccc45081f775f3595a3c67c16f8178137fd903d2a6b658aabc9c20f4cae2785c9b03bda1622d1f42c15b3b3e549a8b6bb66cdfe557258675bcdc	0	\N	U2FsdGVkX1+oZwc85QyhNH7nPbMzoNcsq6IH15UHZysOaPXcWF5sVXvN9C/fuzYx	\N	active	diamond	1193000	2026-07-09 12:51:03.247+07	https://lh3.googleusercontent.com/a/ACg8ocII-3IS6KqF-WBbnt_CBLmxWQiwXnhIkSs8O3ZgIbBlFVOX6jzr=s96-c	085198526632	\N	\N	1044
5	Dian Nur Wahid	2026-07-12 20:24:54.371+07	2026-07-12 19:19:40.045+07	diannur.intern@gmail.com	\N	\N	3fd3f4ee21803f83623851a5968b2b8648e23c2157c93c1136e40e1195387b0e	686bbc1a8882a816d5e9960a209aa327e1a2b13d4317895a1982d3f887545682b1f4328471c6da89fa97cca48974d79a92e17dbacb30cc47b0148ac009f74a714f7f2510e103e3809eef714024f29c8d2ecabd71600b0e99e20575fcec6a7ade9488d70806f3ab33c26ff034798483fe39eccc95931e1e4f47f292dd954882135ee2d1b096da276f89416962af27960590cb3fa08290c62ca69728ae490386802a358ae7e7d0c7b76d892f704fc0c09ad48364ff5172b1b0d30089f3ec7aaf9dc8b5dfd59d8c165793dc5c89dad4f1d8502e11c10bf241c9e33910ed14b5981bd9b0f73636b2a4343c6f577d3623b4b161e940452f09e43173bf33772c5390d7a495063377f585dd67f56cfe44ddf2f06f21c93626bb49693976663b0a1695e5eff0d2b6e67530270a7b46f0f471a38b84365a0a2067e2f72c22d28a10d692e30ffce644217f55a5ee69b171486f8ef422738250b4fcf3c689d789ca9de19e3a01d684ac4ab289fcd38501bd8001a0a0925e297cf79fdb7d21da3e65d18afb93cd25c9531a1132fe01a9584fab75369d9d49cc577adb22cffd00326421dbf15a614f59328a3c2ca540707a6b337a6ba703bc5ad3e68b86d36f96c01aaca54486a610bd9609bd988573aafc4e23bb6fab9ea0a912ea695fa7918f1f1f63bdcac772bdd9f9a28b8a4c82da1878072a045e9e5bebffa555d0b1c01ff2657ebec34e	0	\N	U2FsdGVkX18OfRgsrtKBWr6XYo00zjdd13Ujj/qV9JbIG7Ej8mL/1IJmFuLYFIru	\N	active	gold	794000	2026-07-12 19:19:39.593+07	https://lh3.googleusercontent.com/a/ACg8ocJRuSs_nhE_iMdbqj-T1mTu4xkHQAgpvE2yEH9V8WE7h8wzOdcA=s96-c	085198526632	\N	\N	794
6	Admin User	2026-07-13 01:06:17.125+07	2026-07-12 21:11:30.326+07	admin@citracommerce.com	\N	\N	\N	$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW	1	\N	\N	\N	active	bronze	0	\N	\N	\N	\N	\N	0
\.


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_roles ("order", parent_id, value, id) FROM stdin;
1	5	customer	67
1	6	admin	68
1	3	customer	19
1	2	customer	21
1	4	customer	38
1	1	customer	104
2	1	admin	105
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	5	8bb75b5f-8a5a-4171-8cd6-1a8b45c198f1	2026-07-12 19:19:40.104+07	2026-07-13 19:19:40.104+07
1	1	b4feb81a-ec0b-456d-a3ef-6e3111b20264	2026-07-07 20:23:09.137+07	2026-07-21 20:23:09.137+07
2	1	9cffa706-887f-4786-b8f4-bedffc9755d3	2026-07-09 12:51:03.309+07	2026-07-23 12:51:03.309+07
3	1	39416055-a654-4aca-b731-a032c121612c	2026-07-12 21:50:10.678+07	2026-07-13 21:50:10.678+07
4	1	7203e333-12f5-4b91-9e08-4a31d0e723ea	2026-07-13 01:07:55.874+07	2026-07-14 01:07:55.874+07
5	1	71f5dd8c-c767-42ee-9d57-d4bde3487652	2026-07-13 01:09:22.457+07	2026-07-14 01:09:22.457+07
1	3	f6557d8e-d831-4fec-ac86-8c735c6b614e	2026-07-09 12:27:00.852+07	2026-07-23 12:27:00.852+07
2	3	1e65141f-500a-43c6-a0e0-523537cc23b8	2026-07-09 12:29:47.925+07	2026-07-23 12:29:47.925+07
3	3	69f7d85e-8601-48e4-a3f1-46f81d1cdb1b	2026-07-09 12:30:14.704+07	2026-07-23 12:30:14.704+07
6	1	c5a884cd-5e09-4ea1-9303-035d3f2f5155	2026-07-13 01:12:34.012+07	2026-07-14 01:12:34.012+07
7	1	1f1e4788-3733-49fc-894d-ef5f42fc31fd	2026-07-13 01:13:56.097+07	2026-07-14 01:13:56.097+07
8	1	7fd91d61-090c-4759-944b-61521df22286	2026-07-13 01:15:33.995+07	2026-07-14 01:15:33.995+07
9	1	c8943df1-b262-4ae1-8299-96c29b059f8d	2026-07-13 01:52:20.593+07	2026-07-14 01:52:20.593+07
10	1	af5738d7-dc1f-4be5-9e2e-60e342e5dce3	2026-07-13 18:51:31.512+07	2026-07-14 18:51:31.512+07
11	1	d1d88fb5-cbff-43e6-926c-1d56305e23e5	2026-07-13 20:07:56.909+07	2026-07-14 20:07:56.909+07
1	4	1668d378-4f72-481d-b4ee-12d05ee8c956	2026-07-09 21:39:52.419+07	2026-07-10 21:39:52.419+07
\.


--
-- Data for Name: variant_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_options (id, _variantoptions_options_order, variant_type_id, label, value, updated_at, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: variant_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variant_types (id, label, name, updated_at, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variants (id, title, product_id, inventory, price_in_u_s_d_enabled, price_in_u_s_d, updated_at, created_at, deleted_at, _status, price_in_i_d_r_enabled, price_in_i_d_r) FROM stdin;
\.


--
-- Data for Name: variants_rels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.variants_rels (id, "order", parent_id, path, variant_options_id) FROM stdin;
\.


--
-- Data for Name: whatsapp_blast_test; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.whatsapp_blast_test (id, updated_at, created_at) FROM stdin;
\.


--
-- Name: _pages_v_blocks_archive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_archive_id_seq', 1, false);


--
-- Name: _pages_v_blocks_banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_banner_id_seq', 1, false);


--
-- Name: _pages_v_blocks_carousel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_carousel_id_seq', 1, false);


--
-- Name: _pages_v_blocks_content_columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_content_columns_id_seq', 1, false);


--
-- Name: _pages_v_blocks_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_content_id_seq', 1, false);


--
-- Name: _pages_v_blocks_cta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_cta_id_seq', 1, false);


--
-- Name: _pages_v_blocks_cta_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_cta_links_id_seq', 1, false);


--
-- Name: _pages_v_blocks_form_block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_form_block_id_seq', 1, false);


--
-- Name: _pages_v_blocks_media_block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_media_block_id_seq', 1, false);


--
-- Name: _pages_v_blocks_three_item_grid_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_blocks_three_item_grid_id_seq', 1, false);


--
-- Name: _pages_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_id_seq', 2, true);


--
-- Name: _pages_v_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_rels_id_seq', 1, false);


--
-- Name: _pages_v_version_hero_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._pages_v_version_hero_links_id_seq', 1, false);


--
-- Name: _products_v_blocks_content_columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_blocks_content_columns_id_seq', 1, false);


--
-- Name: _products_v_blocks_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_blocks_content_id_seq', 1, false);


--
-- Name: _products_v_blocks_cta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_blocks_cta_id_seq', 1, false);


--
-- Name: _products_v_blocks_cta_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_blocks_cta_links_id_seq', 1, false);


--
-- Name: _products_v_blocks_media_block_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_blocks_media_block_id_seq', 1, false);


--
-- Name: _products_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_id_seq', 45, true);


--
-- Name: _products_v_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_rels_id_seq', 62, true);


--
-- Name: _products_v_version_gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_version_gallery_id_seq', 50, true);


--
-- Name: _products_v_version_included_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_version_included_files_id_seq', 126, true);


--
-- Name: _products_v_version_product_f_a_q_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._products_v_version_product_f_a_q_id_seq', 150, true);


--
-- Name: _variants_v_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._variants_v_id_seq', 1, false);


--
-- Name: _variants_v_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public._variants_v_rels_id_seq', 1, false);


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.addresses_id_seq', 2, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_id_seq', 13, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: checkout_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.checkout_sessions_id_seq', 18, true);


--
-- Name: coupons_allowed_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupons_allowed_tiers_id_seq', 1, false);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: digital_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.digital_assets_id_seq', 1, false);


--
-- Name: digital_stock_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.digital_stock_units_id_seq', 2, true);


--
-- Name: download_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.download_access_id_seq', 1, false);


--
-- Name: download_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.download_logs_id_seq', 1, false);


--
-- Name: email_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_templates_id_seq', 1, false);


--
-- Name: footer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.footer_id_seq', 1, false);


--
-- Name: footer_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.footer_rels_id_seq', 1, false);


--
-- Name: form_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.form_submissions_id_seq', 1, false);


--
-- Name: forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forms_id_seq', 1, false);


--
-- Name: header_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.header_id_seq', 1, true);


--
-- Name: header_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.header_rels_id_seq', 1, false);


--
-- Name: licenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.licenses_id_seq', 1, false);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 14, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 23, true);


--
-- Name: orders_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_rels_id_seq', 17, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


--
-- Name: pages_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_rels_id_seq', 1, false);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 12, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 24, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 2, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 36, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 111, true);


--
-- Name: payment_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_transactions_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 7, true);


--
-- Name: products_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_rels_id_seq', 53, true);


--
-- Name: promo_banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.promo_banners_id_seq', 1, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- Name: stock_adjustment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_adjustment_id_seq', 1, true);


--
-- Name: stock_ledger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_ledger_id_seq', 60, true);


--
-- Name: stock_reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_reservations_id_seq', 27, true);


--
-- Name: support_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_messages_id_seq', 5, true);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, true);


--
-- Name: testimonials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.testimonials_id_seq', 1, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 20, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: users_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_roles_id_seq', 105, true);


--
-- Name: variant_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variant_options_id_seq', 1, false);


--
-- Name: variant_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variant_types_id_seq', 1, false);


--
-- Name: variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variants_id_seq', 1, false);


--
-- Name: variants_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variants_rels_id_seq', 1, false);


--
-- Name: whatsapp_blast_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.whatsapp_blast_test_id_seq', 1, false);


--
-- Name: _pages_v_blocks_archive _pages_v_blocks_archive_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_archive
    ADD CONSTRAINT _pages_v_blocks_archive_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_banner _pages_v_blocks_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_banner
    ADD CONSTRAINT _pages_v_blocks_banner_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_carousel _pages_v_blocks_carousel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_carousel
    ADD CONSTRAINT _pages_v_blocks_carousel_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_content_columns _pages_v_blocks_content_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content_columns
    ADD CONSTRAINT _pages_v_blocks_content_columns_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_content _pages_v_blocks_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content
    ADD CONSTRAINT _pages_v_blocks_content_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_cta_links _pages_v_blocks_cta_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta_links
    ADD CONSTRAINT _pages_v_blocks_cta_links_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_cta _pages_v_blocks_cta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta
    ADD CONSTRAINT _pages_v_blocks_cta_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_form_block _pages_v_blocks_form_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_form_block
    ADD CONSTRAINT _pages_v_blocks_form_block_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_media_block _pages_v_blocks_media_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_media_block
    ADD CONSTRAINT _pages_v_blocks_media_block_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_blocks_three_item_grid _pages_v_blocks_three_item_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_three_item_grid
    ADD CONSTRAINT _pages_v_blocks_three_item_grid_pkey PRIMARY KEY (id);


--
-- Name: _pages_v _pages_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_rels _pages_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_version_hero_links _pages_v_version_hero_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_version_hero_links
    ADD CONSTRAINT _pages_v_version_hero_links_pkey PRIMARY KEY (id);


--
-- Name: _products_v_blocks_content_columns _products_v_blocks_content_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content_columns
    ADD CONSTRAINT _products_v_blocks_content_columns_pkey PRIMARY KEY (id);


--
-- Name: _products_v_blocks_content _products_v_blocks_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content
    ADD CONSTRAINT _products_v_blocks_content_pkey PRIMARY KEY (id);


--
-- Name: _products_v_blocks_cta_links _products_v_blocks_cta_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta_links
    ADD CONSTRAINT _products_v_blocks_cta_links_pkey PRIMARY KEY (id);


--
-- Name: _products_v_blocks_cta _products_v_blocks_cta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta
    ADD CONSTRAINT _products_v_blocks_cta_pkey PRIMARY KEY (id);


--
-- Name: _products_v_blocks_media_block _products_v_blocks_media_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_media_block
    ADD CONSTRAINT _products_v_blocks_media_block_pkey PRIMARY KEY (id);


--
-- Name: _products_v _products_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v
    ADD CONSTRAINT _products_v_pkey PRIMARY KEY (id);


--
-- Name: _products_v_rels _products_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _products_v_version_gallery _products_v_version_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_gallery
    ADD CONSTRAINT _products_v_version_gallery_pkey PRIMARY KEY (id);


--
-- Name: _products_v_version_included_files _products_v_version_included_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_included_files
    ADD CONSTRAINT _products_v_version_included_files_pkey PRIMARY KEY (id);


--
-- Name: _products_v_version_product_f_a_q _products_v_version_product_f_a_q_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_product_f_a_q
    ADD CONSTRAINT _products_v_version_product_f_a_q_pkey PRIMARY KEY (id);


--
-- Name: _variants_v _variants_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v
    ADD CONSTRAINT _variants_v_pkey PRIMARY KEY (id);


--
-- Name: _variants_v_rels _variants_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v_rels
    ADD CONSTRAINT _variants_v_rels_pkey PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: carts_items carts_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: checkout_sessions checkout_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkout_sessions
    ADD CONSTRAINT checkout_sessions_pkey PRIMARY KEY (id);


--
-- Name: coupons_allowed_tiers coupons_allowed_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons_allowed_tiers
    ADD CONSTRAINT coupons_allowed_tiers_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: digital_assets digital_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_assets
    ADD CONSTRAINT digital_assets_pkey PRIMARY KEY (id);


--
-- Name: digital_stock_units digital_stock_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units
    ADD CONSTRAINT digital_stock_units_pkey PRIMARY KEY (id);


--
-- Name: download_access download_access_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access
    ADD CONSTRAINT download_access_pkey PRIMARY KEY (id);


--
-- Name: download_logs download_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs
    ADD CONSTRAINT download_logs_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: footer_nav_items footer_nav_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_nav_items
    ADD CONSTRAINT footer_nav_items_pkey PRIMARY KEY (id);


--
-- Name: footer footer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer
    ADD CONSTRAINT footer_pkey PRIMARY KEY (id);


--
-- Name: footer_rels footer_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_rels
    ADD CONSTRAINT footer_rels_pkey PRIMARY KEY (id);


--
-- Name: form_submissions form_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_pkey PRIMARY KEY (id);


--
-- Name: form_submissions_submission_data form_submissions_submission_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions_submission_data
    ADD CONSTRAINT form_submissions_submission_data_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_checkbox forms_blocks_checkbox_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_checkbox
    ADD CONSTRAINT forms_blocks_checkbox_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_country forms_blocks_country_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_country
    ADD CONSTRAINT forms_blocks_country_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_email forms_blocks_email_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_email
    ADD CONSTRAINT forms_blocks_email_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_message forms_blocks_message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_message
    ADD CONSTRAINT forms_blocks_message_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_number forms_blocks_number_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_number
    ADD CONSTRAINT forms_blocks_number_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_select_options forms_blocks_select_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_select_options
    ADD CONSTRAINT forms_blocks_select_options_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_select forms_blocks_select_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_select
    ADD CONSTRAINT forms_blocks_select_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_state forms_blocks_state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_state
    ADD CONSTRAINT forms_blocks_state_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_text forms_blocks_text_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_text
    ADD CONSTRAINT forms_blocks_text_pkey PRIMARY KEY (id);


--
-- Name: forms_blocks_textarea forms_blocks_textarea_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_textarea
    ADD CONSTRAINT forms_blocks_textarea_pkey PRIMARY KEY (id);


--
-- Name: forms_emails forms_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_emails
    ADD CONSTRAINT forms_emails_pkey PRIMARY KEY (id);


--
-- Name: forms forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT forms_pkey PRIMARY KEY (id);


--
-- Name: header_nav_items header_nav_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_nav_items
    ADD CONSTRAINT header_nav_items_pkey PRIMARY KEY (id);


--
-- Name: header header_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header
    ADD CONSTRAINT header_pkey PRIMARY KEY (id);


--
-- Name: header_rels header_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_rels
    ADD CONSTRAINT header_rels_pkey PRIMARY KEY (id);


--
-- Name: licenses licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: orders_digital_deliveries orders_digital_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries
    ADD CONSTRAINT orders_digital_deliveries_pkey PRIMARY KEY (id);


--
-- Name: orders_digital_deliveries_units orders_digital_deliveries_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries_units
    ADD CONSTRAINT orders_digital_deliveries_units_pkey PRIMARY KEY (id);


--
-- Name: orders_items orders_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders_rels orders_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_rels
    ADD CONSTRAINT orders_rels_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_archive pages_blocks_archive_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_archive
    ADD CONSTRAINT pages_blocks_archive_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_banner pages_blocks_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_banner
    ADD CONSTRAINT pages_blocks_banner_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_carousel pages_blocks_carousel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_carousel
    ADD CONSTRAINT pages_blocks_carousel_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_content_columns pages_blocks_content_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_content_columns
    ADD CONSTRAINT pages_blocks_content_columns_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_content pages_blocks_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_content
    ADD CONSTRAINT pages_blocks_content_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_cta_links pages_blocks_cta_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_cta_links
    ADD CONSTRAINT pages_blocks_cta_links_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_cta pages_blocks_cta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_cta
    ADD CONSTRAINT pages_blocks_cta_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_form_block pages_blocks_form_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_form_block
    ADD CONSTRAINT pages_blocks_form_block_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_media_block pages_blocks_media_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_media_block
    ADD CONSTRAINT pages_blocks_media_block_pkey PRIMARY KEY (id);


--
-- Name: pages_blocks_three_item_grid pages_blocks_three_item_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_three_item_grid
    ADD CONSTRAINT pages_blocks_three_item_grid_pkey PRIMARY KEY (id);


--
-- Name: pages_hero_links pages_hero_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_hero_links
    ADD CONSTRAINT pages_hero_links_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages_rels pages_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: products_blocks_content_columns products_blocks_content_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_content_columns
    ADD CONSTRAINT products_blocks_content_columns_pkey PRIMARY KEY (id);


--
-- Name: products_blocks_content products_blocks_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_content
    ADD CONSTRAINT products_blocks_content_pkey PRIMARY KEY (id);


--
-- Name: products_blocks_cta_links products_blocks_cta_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_cta_links
    ADD CONSTRAINT products_blocks_cta_links_pkey PRIMARY KEY (id);


--
-- Name: products_blocks_cta products_blocks_cta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_cta
    ADD CONSTRAINT products_blocks_cta_pkey PRIMARY KEY (id);


--
-- Name: products_blocks_media_block products_blocks_media_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_media_block
    ADD CONSTRAINT products_blocks_media_block_pkey PRIMARY KEY (id);


--
-- Name: products_gallery products_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_gallery
    ADD CONSTRAINT products_gallery_pkey PRIMARY KEY (id);


--
-- Name: products_included_files products_included_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_included_files
    ADD CONSTRAINT products_included_files_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products_product_f_a_q products_product_f_a_q_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_product_f_a_q
    ADD CONSTRAINT products_product_f_a_q_pkey PRIMARY KEY (id);


--
-- Name: products_rels products_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_pkey PRIMARY KEY (id);


--
-- Name: promo_banners promo_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_banners
    ADD CONSTRAINT promo_banners_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: settings_trust_badges_partner_logos settings_trust_badges_partner_logos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_trust_badges_partner_logos
    ADD CONSTRAINT settings_trust_badges_partner_logos_pkey PRIMARY KEY (id);


--
-- Name: stock_adjustment stock_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_adjustment
    ADD CONSTRAINT stock_adjustment_pkey PRIMARY KEY (id);


--
-- Name: stock_ledger stock_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_pkey PRIMARY KEY (id);


--
-- Name: stock_reservations stock_reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_pkey PRIMARY KEY (id);


--
-- Name: support_messages_attachments support_messages_attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages_attachments
    ADD CONSTRAINT support_messages_attachments_pkey PRIMARY KEY (id);


--
-- Name: support_messages support_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: transactions_items transactions_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_items
    ADD CONSTRAINT transactions_items_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_roles users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: variant_options variant_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_options
    ADD CONSTRAINT variant_options_pkey PRIMARY KEY (id);


--
-- Name: variant_types variant_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_types
    ADD CONSTRAINT variant_types_pkey PRIMARY KEY (id);


--
-- Name: variants variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (id);


--
-- Name: variants_rels variants_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants_rels
    ADD CONSTRAINT variants_rels_pkey PRIMARY KEY (id);


--
-- Name: whatsapp_blast_test whatsapp_blast_test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.whatsapp_blast_test
    ADD CONSTRAINT whatsapp_blast_test_pkey PRIMARY KEY (id);


--
-- Name: _pages_v_autosave_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_autosave_idx ON public._pages_v USING btree (autosave);


--
-- Name: _pages_v_blocks_archive_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_archive_order_idx ON public._pages_v_blocks_archive USING btree (_order);


--
-- Name: _pages_v_blocks_archive_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_archive_parent_id_idx ON public._pages_v_blocks_archive USING btree (_parent_id);


--
-- Name: _pages_v_blocks_archive_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_archive_path_idx ON public._pages_v_blocks_archive USING btree (_path);


--
-- Name: _pages_v_blocks_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_banner_order_idx ON public._pages_v_blocks_banner USING btree (_order);


--
-- Name: _pages_v_blocks_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_banner_parent_id_idx ON public._pages_v_blocks_banner USING btree (_parent_id);


--
-- Name: _pages_v_blocks_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_banner_path_idx ON public._pages_v_blocks_banner USING btree (_path);


--
-- Name: _pages_v_blocks_carousel_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_carousel_order_idx ON public._pages_v_blocks_carousel USING btree (_order);


--
-- Name: _pages_v_blocks_carousel_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_carousel_parent_id_idx ON public._pages_v_blocks_carousel USING btree (_parent_id);


--
-- Name: _pages_v_blocks_carousel_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_carousel_path_idx ON public._pages_v_blocks_carousel USING btree (_path);


--
-- Name: _pages_v_blocks_content_columns_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_content_columns_order_idx ON public._pages_v_blocks_content_columns USING btree (_order);


--
-- Name: _pages_v_blocks_content_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_content_columns_parent_id_idx ON public._pages_v_blocks_content_columns USING btree (_parent_id);


--
-- Name: _pages_v_blocks_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_content_order_idx ON public._pages_v_blocks_content USING btree (_order);


--
-- Name: _pages_v_blocks_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_content_parent_id_idx ON public._pages_v_blocks_content USING btree (_parent_id);


--
-- Name: _pages_v_blocks_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_content_path_idx ON public._pages_v_blocks_content USING btree (_path);


--
-- Name: _pages_v_blocks_cta_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_cta_links_order_idx ON public._pages_v_blocks_cta_links USING btree (_order);


--
-- Name: _pages_v_blocks_cta_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_cta_links_parent_id_idx ON public._pages_v_blocks_cta_links USING btree (_parent_id);


--
-- Name: _pages_v_blocks_cta_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_cta_order_idx ON public._pages_v_blocks_cta USING btree (_order);


--
-- Name: _pages_v_blocks_cta_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_cta_parent_id_idx ON public._pages_v_blocks_cta USING btree (_parent_id);


--
-- Name: _pages_v_blocks_cta_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_cta_path_idx ON public._pages_v_blocks_cta USING btree (_path);


--
-- Name: _pages_v_blocks_form_block_form_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_form_block_form_idx ON public._pages_v_blocks_form_block USING btree (form_id);


--
-- Name: _pages_v_blocks_form_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_form_block_order_idx ON public._pages_v_blocks_form_block USING btree (_order);


--
-- Name: _pages_v_blocks_form_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_form_block_parent_id_idx ON public._pages_v_blocks_form_block USING btree (_parent_id);


--
-- Name: _pages_v_blocks_form_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_form_block_path_idx ON public._pages_v_blocks_form_block USING btree (_path);


--
-- Name: _pages_v_blocks_media_block_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_media_block_media_idx ON public._pages_v_blocks_media_block USING btree (media_id);


--
-- Name: _pages_v_blocks_media_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_media_block_order_idx ON public._pages_v_blocks_media_block USING btree (_order);


--
-- Name: _pages_v_blocks_media_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_media_block_parent_id_idx ON public._pages_v_blocks_media_block USING btree (_parent_id);


--
-- Name: _pages_v_blocks_media_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_media_block_path_idx ON public._pages_v_blocks_media_block USING btree (_path);


--
-- Name: _pages_v_blocks_three_item_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_three_item_grid_order_idx ON public._pages_v_blocks_three_item_grid USING btree (_order);


--
-- Name: _pages_v_blocks_three_item_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_three_item_grid_parent_id_idx ON public._pages_v_blocks_three_item_grid USING btree (_parent_id);


--
-- Name: _pages_v_blocks_three_item_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_blocks_three_item_grid_path_idx ON public._pages_v_blocks_three_item_grid USING btree (_path);


--
-- Name: _pages_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_created_at_idx ON public._pages_v USING btree (created_at);


--
-- Name: _pages_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_latest_idx ON public._pages_v USING btree (latest);


--
-- Name: _pages_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_parent_idx ON public._pages_v USING btree (parent_id);


--
-- Name: _pages_v_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_categories_id_idx ON public._pages_v_rels USING btree (categories_id);


--
-- Name: _pages_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_order_idx ON public._pages_v_rels USING btree ("order");


--
-- Name: _pages_v_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_pages_id_idx ON public._pages_v_rels USING btree (pages_id);


--
-- Name: _pages_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_parent_idx ON public._pages_v_rels USING btree (parent_id);


--
-- Name: _pages_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_path_idx ON public._pages_v_rels USING btree (path);


--
-- Name: _pages_v_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_rels_products_id_idx ON public._pages_v_rels USING btree (products_id);


--
-- Name: _pages_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_updated_at_idx ON public._pages_v USING btree (updated_at);


--
-- Name: _pages_v_version_hero_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_hero_links_order_idx ON public._pages_v_version_hero_links USING btree (_order);


--
-- Name: _pages_v_version_hero_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_hero_links_parent_id_idx ON public._pages_v_version_hero_links USING btree (_parent_id);


--
-- Name: _pages_v_version_hero_version_hero_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_hero_version_hero_media_idx ON public._pages_v USING btree (version_hero_media_id);


--
-- Name: _pages_v_version_meta_version_meta_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_meta_version_meta_image_idx ON public._pages_v USING btree (version_meta_image_id);


--
-- Name: _pages_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version__status_idx ON public._pages_v USING btree (version__status);


--
-- Name: _pages_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_created_at_idx ON public._pages_v USING btree (version_created_at);


--
-- Name: _pages_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_slug_idx ON public._pages_v USING btree (version_slug);


--
-- Name: _pages_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _pages_v_version_version_updated_at_idx ON public._pages_v USING btree (version_updated_at);


--
-- Name: _products_v_autosave_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_autosave_idx ON public._products_v USING btree (autosave);


--
-- Name: _products_v_blocks_content_columns_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_content_columns_order_idx ON public._products_v_blocks_content_columns USING btree (_order);


--
-- Name: _products_v_blocks_content_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_content_columns_parent_id_idx ON public._products_v_blocks_content_columns USING btree (_parent_id);


--
-- Name: _products_v_blocks_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_content_order_idx ON public._products_v_blocks_content USING btree (_order);


--
-- Name: _products_v_blocks_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_content_parent_id_idx ON public._products_v_blocks_content USING btree (_parent_id);


--
-- Name: _products_v_blocks_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_content_path_idx ON public._products_v_blocks_content USING btree (_path);


--
-- Name: _products_v_blocks_cta_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_cta_links_order_idx ON public._products_v_blocks_cta_links USING btree (_order);


--
-- Name: _products_v_blocks_cta_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_cta_links_parent_id_idx ON public._products_v_blocks_cta_links USING btree (_parent_id);


--
-- Name: _products_v_blocks_cta_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_cta_order_idx ON public._products_v_blocks_cta USING btree (_order);


--
-- Name: _products_v_blocks_cta_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_cta_parent_id_idx ON public._products_v_blocks_cta USING btree (_parent_id);


--
-- Name: _products_v_blocks_cta_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_cta_path_idx ON public._products_v_blocks_cta USING btree (_path);


--
-- Name: _products_v_blocks_media_block_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_media_block_media_idx ON public._products_v_blocks_media_block USING btree (media_id);


--
-- Name: _products_v_blocks_media_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_media_block_order_idx ON public._products_v_blocks_media_block USING btree (_order);


--
-- Name: _products_v_blocks_media_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_media_block_parent_id_idx ON public._products_v_blocks_media_block USING btree (_parent_id);


--
-- Name: _products_v_blocks_media_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_blocks_media_block_path_idx ON public._products_v_blocks_media_block USING btree (_path);


--
-- Name: _products_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_created_at_idx ON public._products_v USING btree (created_at);


--
-- Name: _products_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_latest_idx ON public._products_v USING btree (latest);


--
-- Name: _products_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_parent_idx ON public._products_v USING btree (parent_id);


--
-- Name: _products_v_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_categories_id_idx ON public._products_v_rels USING btree (categories_id);


--
-- Name: _products_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_order_idx ON public._products_v_rels USING btree ("order");


--
-- Name: _products_v_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_pages_id_idx ON public._products_v_rels USING btree (pages_id);


--
-- Name: _products_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_parent_idx ON public._products_v_rels USING btree (parent_id);


--
-- Name: _products_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_path_idx ON public._products_v_rels USING btree (path);


--
-- Name: _products_v_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_products_id_idx ON public._products_v_rels USING btree (products_id);


--
-- Name: _products_v_rels_variant_types_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_rels_variant_types_id_idx ON public._products_v_rels USING btree (variant_types_id);


--
-- Name: _products_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_updated_at_idx ON public._products_v USING btree (updated_at);


--
-- Name: _products_v_version_gallery_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_gallery_image_idx ON public._products_v_version_gallery USING btree (image_id);


--
-- Name: _products_v_version_gallery_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_gallery_order_idx ON public._products_v_version_gallery USING btree (_order);


--
-- Name: _products_v_version_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_gallery_parent_id_idx ON public._products_v_version_gallery USING btree (_parent_id);


--
-- Name: _products_v_version_gallery_variant_option_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_gallery_variant_option_idx ON public._products_v_version_gallery USING btree (variant_option_id);


--
-- Name: _products_v_version_included_files_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_included_files_order_idx ON public._products_v_version_included_files USING btree (_order);


--
-- Name: _products_v_version_included_files_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_included_files_parent_id_idx ON public._products_v_version_included_files USING btree (_parent_id);


--
-- Name: _products_v_version_meta_version_meta_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_meta_version_meta_image_idx ON public._products_v USING btree (version_meta_image_id);


--
-- Name: _products_v_version_product_f_a_q_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_product_f_a_q_order_idx ON public._products_v_version_product_f_a_q USING btree (_order);


--
-- Name: _products_v_version_product_f_a_q_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_product_f_a_q_parent_id_idx ON public._products_v_version_product_f_a_q USING btree (_parent_id);


--
-- Name: _products_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_version__status_idx ON public._products_v USING btree (version__status);


--
-- Name: _products_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_version_created_at_idx ON public._products_v USING btree (version_created_at);


--
-- Name: _products_v_version_version_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_version_deleted_at_idx ON public._products_v USING btree (version_deleted_at);


--
-- Name: _products_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_version_slug_idx ON public._products_v USING btree (version_slug);


--
-- Name: _products_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _products_v_version_version_updated_at_idx ON public._products_v USING btree (version_updated_at);


--
-- Name: _variants_v_autosave_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_autosave_idx ON public._variants_v USING btree (autosave);


--
-- Name: _variants_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_created_at_idx ON public._variants_v USING btree (created_at);


--
-- Name: _variants_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_latest_idx ON public._variants_v USING btree (latest);


--
-- Name: _variants_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_parent_idx ON public._variants_v USING btree (parent_id);


--
-- Name: _variants_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_rels_order_idx ON public._variants_v_rels USING btree ("order");


--
-- Name: _variants_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_rels_parent_idx ON public._variants_v_rels USING btree (parent_id);


--
-- Name: _variants_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_rels_path_idx ON public._variants_v_rels USING btree (path);


--
-- Name: _variants_v_rels_variant_options_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_rels_variant_options_id_idx ON public._variants_v_rels USING btree (variant_options_id);


--
-- Name: _variants_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_updated_at_idx ON public._variants_v USING btree (updated_at);


--
-- Name: _variants_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_version_version__status_idx ON public._variants_v USING btree (version__status);


--
-- Name: _variants_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_version_version_created_at_idx ON public._variants_v USING btree (version_created_at);


--
-- Name: _variants_v_version_version_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_version_version_deleted_at_idx ON public._variants_v USING btree (version_deleted_at);


--
-- Name: _variants_v_version_version_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_version_version_product_idx ON public._variants_v USING btree (version_product_id);


--
-- Name: _variants_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _variants_v_version_version_updated_at_idx ON public._variants_v USING btree (version_updated_at);


--
-- Name: addresses_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX addresses_created_at_idx ON public.addresses USING btree (created_at);


--
-- Name: addresses_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX addresses_customer_idx ON public.addresses USING btree (customer_id);


--
-- Name: addresses_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX addresses_updated_at_idx ON public.addresses USING btree (updated_at);


--
-- Name: carts_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_created_at_idx ON public.carts USING btree (created_at);


--
-- Name: carts_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_customer_idx ON public.carts USING btree (customer_id);


--
-- Name: carts_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_items_order_idx ON public.carts_items USING btree (_order);


--
-- Name: carts_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_items_parent_id_idx ON public.carts_items USING btree (_parent_id);


--
-- Name: carts_items_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_items_product_idx ON public.carts_items USING btree (product_id);


--
-- Name: carts_items_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_items_variant_idx ON public.carts_items USING btree (variant_id);


--
-- Name: carts_secret_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_secret_idx ON public.carts USING btree (secret);


--
-- Name: carts_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX carts_updated_at_idx ON public.carts USING btree (updated_at);


--
-- Name: categories_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_created_at_idx ON public.categories USING btree (created_at);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- Name: categories_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX categories_updated_at_idx ON public.categories USING btree (updated_at);


--
-- Name: checkout_sessions_active_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX checkout_sessions_active_key_idx ON public.checkout_sessions USING btree (active_key);


--
-- Name: checkout_sessions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_created_at_idx ON public.checkout_sessions USING btree (created_at);


--
-- Name: checkout_sessions_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_customer_idx ON public.checkout_sessions USING btree (customer_id);


--
-- Name: checkout_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_expires_at_idx ON public.checkout_sessions USING btree (expires_at);


--
-- Name: checkout_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_order_idx ON public.checkout_sessions USING btree (order_id);


--
-- Name: checkout_sessions_reservation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_reservation_id_idx ON public.checkout_sessions USING btree (reservation_id);


--
-- Name: checkout_sessions_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX checkout_sessions_session_id_idx ON public.checkout_sessions USING btree (session_id);


--
-- Name: checkout_sessions_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_status_idx ON public.checkout_sessions USING btree (status);


--
-- Name: checkout_sessions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX checkout_sessions_updated_at_idx ON public.checkout_sessions USING btree (updated_at);


--
-- Name: coupons_allowed_tiers_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_allowed_tiers_order_idx ON public.coupons_allowed_tiers USING btree ("order");


--
-- Name: coupons_allowed_tiers_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_allowed_tiers_parent_idx ON public.coupons_allowed_tiers USING btree (parent_id);


--
-- Name: coupons_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX coupons_code_idx ON public.coupons USING btree (code);


--
-- Name: coupons_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_created_at_idx ON public.coupons USING btree (created_at);


--
-- Name: coupons_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX coupons_updated_at_idx ON public.coupons USING btree (updated_at);


--
-- Name: digital_assets_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_assets_created_at_idx ON public.digital_assets USING btree (created_at);


--
-- Name: digital_assets_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_assets_file_idx ON public.digital_assets USING btree (file_id);


--
-- Name: digital_assets_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_assets_product_idx ON public.digital_assets USING btree (product_id);


--
-- Name: digital_assets_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_assets_updated_at_idx ON public.digital_assets USING btree (updated_at);


--
-- Name: digital_stock_units_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_created_at_idx ON public.digital_stock_units USING btree (created_at);


--
-- Name: digital_stock_units_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_customer_idx ON public.digital_stock_units USING btree (customer_id);


--
-- Name: digital_stock_units_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_file_idx ON public.digital_stock_units USING btree (file_id);


--
-- Name: digital_stock_units_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_order_idx ON public.digital_stock_units USING btree (order_id);


--
-- Name: digital_stock_units_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_product_idx ON public.digital_stock_units USING btree (product_id);


--
-- Name: digital_stock_units_reservation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_reservation_id_idx ON public.digital_stock_units USING btree (reservation_id);


--
-- Name: digital_stock_units_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_status_idx ON public.digital_stock_units USING btree (status);


--
-- Name: digital_stock_units_unit_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX digital_stock_units_unit_code_idx ON public.digital_stock_units USING btree (unit_code);


--
-- Name: digital_stock_units_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_updated_at_idx ON public.digital_stock_units USING btree (updated_at);


--
-- Name: digital_stock_units_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX digital_stock_units_variant_idx ON public.digital_stock_units USING btree (variant);


--
-- Name: download_access_asset_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_asset_idx ON public.download_access USING btree (asset_id);


--
-- Name: download_access_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_created_at_idx ON public.download_access USING btree (created_at);


--
-- Name: download_access_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_customer_idx ON public.download_access USING btree (customer_id);


--
-- Name: download_access_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_order_idx ON public.download_access USING btree (order_id);


--
-- Name: download_access_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_product_idx ON public.download_access USING btree (product_id);


--
-- Name: download_access_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_access_updated_at_idx ON public.download_access USING btree (updated_at);


--
-- Name: download_logs_asset_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_asset_idx ON public.download_logs USING btree (asset_id);


--
-- Name: download_logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_created_at_idx ON public.download_logs USING btree (created_at);


--
-- Name: download_logs_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_customer_idx ON public.download_logs USING btree (customer_id);


--
-- Name: download_logs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_order_idx ON public.download_logs USING btree (order_id);


--
-- Name: download_logs_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_product_idx ON public.download_logs USING btree (product_id);


--
-- Name: download_logs_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX download_logs_updated_at_idx ON public.download_logs USING btree (updated_at);


--
-- Name: email_templates_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_templates_created_at_idx ON public.email_templates USING btree (created_at);


--
-- Name: email_templates_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_templates_updated_at_idx ON public.email_templates USING btree (updated_at);


--
-- Name: footer_nav_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_nav_items_order_idx ON public.footer_nav_items USING btree (_order);


--
-- Name: footer_nav_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_nav_items_parent_id_idx ON public.footer_nav_items USING btree (_parent_id);


--
-- Name: footer_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_rels_order_idx ON public.footer_rels USING btree ("order");


--
-- Name: footer_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_rels_pages_id_idx ON public.footer_rels USING btree (pages_id);


--
-- Name: footer_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_rels_parent_idx ON public.footer_rels USING btree (parent_id);


--
-- Name: footer_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX footer_rels_path_idx ON public.footer_rels USING btree (path);


--
-- Name: form_submissions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_submissions_created_at_idx ON public.form_submissions USING btree (created_at);


--
-- Name: form_submissions_form_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_submissions_form_idx ON public.form_submissions USING btree (form_id);


--
-- Name: form_submissions_submission_data_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_submissions_submission_data_order_idx ON public.form_submissions_submission_data USING btree (_order);


--
-- Name: form_submissions_submission_data_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_submissions_submission_data_parent_id_idx ON public.form_submissions_submission_data USING btree (_parent_id);


--
-- Name: form_submissions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX form_submissions_updated_at_idx ON public.form_submissions USING btree (updated_at);


--
-- Name: forms_blocks_checkbox_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_checkbox_order_idx ON public.forms_blocks_checkbox USING btree (_order);


--
-- Name: forms_blocks_checkbox_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_checkbox_parent_id_idx ON public.forms_blocks_checkbox USING btree (_parent_id);


--
-- Name: forms_blocks_checkbox_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_checkbox_path_idx ON public.forms_blocks_checkbox USING btree (_path);


--
-- Name: forms_blocks_country_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_country_order_idx ON public.forms_blocks_country USING btree (_order);


--
-- Name: forms_blocks_country_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_country_parent_id_idx ON public.forms_blocks_country USING btree (_parent_id);


--
-- Name: forms_blocks_country_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_country_path_idx ON public.forms_blocks_country USING btree (_path);


--
-- Name: forms_blocks_email_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_email_order_idx ON public.forms_blocks_email USING btree (_order);


--
-- Name: forms_blocks_email_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_email_parent_id_idx ON public.forms_blocks_email USING btree (_parent_id);


--
-- Name: forms_blocks_email_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_email_path_idx ON public.forms_blocks_email USING btree (_path);


--
-- Name: forms_blocks_message_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_message_order_idx ON public.forms_blocks_message USING btree (_order);


--
-- Name: forms_blocks_message_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_message_parent_id_idx ON public.forms_blocks_message USING btree (_parent_id);


--
-- Name: forms_blocks_message_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_message_path_idx ON public.forms_blocks_message USING btree (_path);


--
-- Name: forms_blocks_number_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_number_order_idx ON public.forms_blocks_number USING btree (_order);


--
-- Name: forms_blocks_number_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_number_parent_id_idx ON public.forms_blocks_number USING btree (_parent_id);


--
-- Name: forms_blocks_number_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_number_path_idx ON public.forms_blocks_number USING btree (_path);


--
-- Name: forms_blocks_select_options_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_select_options_order_idx ON public.forms_blocks_select_options USING btree (_order);


--
-- Name: forms_blocks_select_options_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_select_options_parent_id_idx ON public.forms_blocks_select_options USING btree (_parent_id);


--
-- Name: forms_blocks_select_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_select_order_idx ON public.forms_blocks_select USING btree (_order);


--
-- Name: forms_blocks_select_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_select_parent_id_idx ON public.forms_blocks_select USING btree (_parent_id);


--
-- Name: forms_blocks_select_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_select_path_idx ON public.forms_blocks_select USING btree (_path);


--
-- Name: forms_blocks_state_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_state_order_idx ON public.forms_blocks_state USING btree (_order);


--
-- Name: forms_blocks_state_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_state_parent_id_idx ON public.forms_blocks_state USING btree (_parent_id);


--
-- Name: forms_blocks_state_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_state_path_idx ON public.forms_blocks_state USING btree (_path);


--
-- Name: forms_blocks_text_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_text_order_idx ON public.forms_blocks_text USING btree (_order);


--
-- Name: forms_blocks_text_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_text_parent_id_idx ON public.forms_blocks_text USING btree (_parent_id);


--
-- Name: forms_blocks_text_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_text_path_idx ON public.forms_blocks_text USING btree (_path);


--
-- Name: forms_blocks_textarea_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_textarea_order_idx ON public.forms_blocks_textarea USING btree (_order);


--
-- Name: forms_blocks_textarea_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_textarea_parent_id_idx ON public.forms_blocks_textarea USING btree (_parent_id);


--
-- Name: forms_blocks_textarea_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_blocks_textarea_path_idx ON public.forms_blocks_textarea USING btree (_path);


--
-- Name: forms_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_created_at_idx ON public.forms USING btree (created_at);


--
-- Name: forms_emails_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_emails_order_idx ON public.forms_emails USING btree (_order);


--
-- Name: forms_emails_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_emails_parent_id_idx ON public.forms_emails USING btree (_parent_id);


--
-- Name: forms_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX forms_updated_at_idx ON public.forms USING btree (updated_at);


--
-- Name: header_nav_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_nav_items_order_idx ON public.header_nav_items USING btree (_order);


--
-- Name: header_nav_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_nav_items_parent_id_idx ON public.header_nav_items USING btree (_parent_id);


--
-- Name: header_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_rels_order_idx ON public.header_rels USING btree ("order");


--
-- Name: header_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_rels_pages_id_idx ON public.header_rels USING btree (pages_id);


--
-- Name: header_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_rels_parent_idx ON public.header_rels USING btree (parent_id);


--
-- Name: header_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX header_rels_path_idx ON public.header_rels USING btree (path);


--
-- Name: licenses_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX licenses_created_at_idx ON public.licenses USING btree (created_at);


--
-- Name: licenses_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX licenses_customer_idx ON public.licenses USING btree (customer_id);


--
-- Name: licenses_license_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX licenses_license_key_idx ON public.licenses USING btree (license_key);


--
-- Name: licenses_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX licenses_order_idx ON public.licenses USING btree (order_id);


--
-- Name: licenses_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX licenses_product_idx ON public.licenses USING btree (product_id);


--
-- Name: licenses_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX licenses_updated_at_idx ON public.licenses USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: media_uploaded_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_uploaded_by_idx ON public.media USING btree (uploaded_by_id);


--
-- Name: orders_access_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX orders_access_token_idx ON public.orders USING btree (access_token);


--
-- Name: orders_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_created_at_idx ON public.orders USING btree (created_at);


--
-- Name: orders_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_customer_idx ON public.orders USING btree (customer_id);


--
-- Name: orders_digital_deliveries_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_order_idx ON public.orders_digital_deliveries USING btree (_order);


--
-- Name: orders_digital_deliveries_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_parent_id_idx ON public.orders_digital_deliveries USING btree (_parent_id);


--
-- Name: orders_digital_deliveries_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_product_idx ON public.orders_digital_deliveries USING btree (product_id);


--
-- Name: orders_digital_deliveries_units_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_units_file_idx ON public.orders_digital_deliveries_units USING btree (file_id);


--
-- Name: orders_digital_deliveries_units_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_units_order_idx ON public.orders_digital_deliveries_units USING btree (_order);


--
-- Name: orders_digital_deliveries_units_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_digital_deliveries_units_parent_id_idx ON public.orders_digital_deliveries_units USING btree (_parent_id);


--
-- Name: orders_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_items_order_idx ON public.orders_items USING btree (_order);


--
-- Name: orders_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_items_parent_id_idx ON public.orders_items USING btree (_parent_id);


--
-- Name: orders_items_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_items_product_idx ON public.orders_items USING btree (product_id);


--
-- Name: orders_items_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_items_variant_idx ON public.orders_items USING btree (variant_id);


--
-- Name: orders_payment_reference_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX orders_payment_reference_idx ON public.orders USING btree (payment_reference);


--
-- Name: orders_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_rels_order_idx ON public.orders_rels USING btree ("order");


--
-- Name: orders_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_rels_parent_idx ON public.orders_rels USING btree (parent_id);


--
-- Name: orders_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_rels_path_idx ON public.orders_rels USING btree (path);


--
-- Name: orders_rels_transactions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_rels_transactions_id_idx ON public.orders_rels USING btree (transactions_id);


--
-- Name: orders_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_updated_at_idx ON public.orders USING btree (updated_at);


--
-- Name: orders_voucher_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_voucher_idx ON public.orders USING btree (voucher_id);


--
-- Name: pages__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages__status_idx ON public.pages USING btree (_status);


--
-- Name: pages_blocks_archive_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_archive_order_idx ON public.pages_blocks_archive USING btree (_order);


--
-- Name: pages_blocks_archive_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_archive_parent_id_idx ON public.pages_blocks_archive USING btree (_parent_id);


--
-- Name: pages_blocks_archive_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_archive_path_idx ON public.pages_blocks_archive USING btree (_path);


--
-- Name: pages_blocks_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_banner_order_idx ON public.pages_blocks_banner USING btree (_order);


--
-- Name: pages_blocks_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_banner_parent_id_idx ON public.pages_blocks_banner USING btree (_parent_id);


--
-- Name: pages_blocks_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_banner_path_idx ON public.pages_blocks_banner USING btree (_path);


--
-- Name: pages_blocks_carousel_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_carousel_order_idx ON public.pages_blocks_carousel USING btree (_order);


--
-- Name: pages_blocks_carousel_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_carousel_parent_id_idx ON public.pages_blocks_carousel USING btree (_parent_id);


--
-- Name: pages_blocks_carousel_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_carousel_path_idx ON public.pages_blocks_carousel USING btree (_path);


--
-- Name: pages_blocks_content_columns_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_content_columns_order_idx ON public.pages_blocks_content_columns USING btree (_order);


--
-- Name: pages_blocks_content_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_content_columns_parent_id_idx ON public.pages_blocks_content_columns USING btree (_parent_id);


--
-- Name: pages_blocks_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_content_order_idx ON public.pages_blocks_content USING btree (_order);


--
-- Name: pages_blocks_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_content_parent_id_idx ON public.pages_blocks_content USING btree (_parent_id);


--
-- Name: pages_blocks_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_content_path_idx ON public.pages_blocks_content USING btree (_path);


--
-- Name: pages_blocks_cta_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_cta_links_order_idx ON public.pages_blocks_cta_links USING btree (_order);


--
-- Name: pages_blocks_cta_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_cta_links_parent_id_idx ON public.pages_blocks_cta_links USING btree (_parent_id);


--
-- Name: pages_blocks_cta_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_cta_order_idx ON public.pages_blocks_cta USING btree (_order);


--
-- Name: pages_blocks_cta_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_cta_parent_id_idx ON public.pages_blocks_cta USING btree (_parent_id);


--
-- Name: pages_blocks_cta_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_cta_path_idx ON public.pages_blocks_cta USING btree (_path);


--
-- Name: pages_blocks_form_block_form_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_form_block_form_idx ON public.pages_blocks_form_block USING btree (form_id);


--
-- Name: pages_blocks_form_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_form_block_order_idx ON public.pages_blocks_form_block USING btree (_order);


--
-- Name: pages_blocks_form_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_form_block_parent_id_idx ON public.pages_blocks_form_block USING btree (_parent_id);


--
-- Name: pages_blocks_form_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_form_block_path_idx ON public.pages_blocks_form_block USING btree (_path);


--
-- Name: pages_blocks_media_block_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_media_block_media_idx ON public.pages_blocks_media_block USING btree (media_id);


--
-- Name: pages_blocks_media_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_media_block_order_idx ON public.pages_blocks_media_block USING btree (_order);


--
-- Name: pages_blocks_media_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_media_block_parent_id_idx ON public.pages_blocks_media_block USING btree (_parent_id);


--
-- Name: pages_blocks_media_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_media_block_path_idx ON public.pages_blocks_media_block USING btree (_path);


--
-- Name: pages_blocks_three_item_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_three_item_grid_order_idx ON public.pages_blocks_three_item_grid USING btree (_order);


--
-- Name: pages_blocks_three_item_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_three_item_grid_parent_id_idx ON public.pages_blocks_three_item_grid USING btree (_parent_id);


--
-- Name: pages_blocks_three_item_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_blocks_three_item_grid_path_idx ON public.pages_blocks_three_item_grid USING btree (_path);


--
-- Name: pages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_created_at_idx ON public.pages USING btree (created_at);


--
-- Name: pages_hero_hero_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_hero_hero_media_idx ON public.pages USING btree (hero_media_id);


--
-- Name: pages_hero_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_hero_links_order_idx ON public.pages_hero_links USING btree (_order);


--
-- Name: pages_hero_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_hero_links_parent_id_idx ON public.pages_hero_links USING btree (_parent_id);


--
-- Name: pages_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_meta_meta_image_idx ON public.pages USING btree (meta_image_id);


--
-- Name: pages_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_categories_id_idx ON public.pages_rels USING btree (categories_id);


--
-- Name: pages_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_order_idx ON public.pages_rels USING btree ("order");


--
-- Name: pages_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_pages_id_idx ON public.pages_rels USING btree (pages_id);


--
-- Name: pages_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_parent_idx ON public.pages_rels USING btree (parent_id);


--
-- Name: pages_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_path_idx ON public.pages_rels USING btree (path);


--
-- Name: pages_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_rels_products_id_idx ON public.pages_rels USING btree (products_id);


--
-- Name: pages_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_idx ON public.pages USING btree (slug);


--
-- Name: pages_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pages_updated_at_idx ON public.pages USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_addresses_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_addresses_id_idx ON public.payload_locked_documents_rels USING btree (addresses_id);


--
-- Name: payload_locked_documents_rels_carts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_carts_id_idx ON public.payload_locked_documents_rels USING btree (carts_id);


--
-- Name: payload_locked_documents_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_categories_id_idx ON public.payload_locked_documents_rels USING btree (categories_id);


--
-- Name: payload_locked_documents_rels_checkout_sessions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_checkout_sessions_id_idx ON public.payload_locked_documents_rels USING btree (checkout_sessions_id);


--
-- Name: payload_locked_documents_rels_coupons_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_coupons_id_idx ON public.payload_locked_documents_rels USING btree (coupons_id);


--
-- Name: payload_locked_documents_rels_digital_assets_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_digital_assets_id_idx ON public.payload_locked_documents_rels USING btree (digital_assets_id);


--
-- Name: payload_locked_documents_rels_digital_stock_units_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_digital_stock_units_id_idx ON public.payload_locked_documents_rels USING btree (digital_stock_units_id);


--
-- Name: payload_locked_documents_rels_download_access_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_download_access_id_idx ON public.payload_locked_documents_rels USING btree (download_access_id);


--
-- Name: payload_locked_documents_rels_download_logs_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_download_logs_id_idx ON public.payload_locked_documents_rels USING btree (download_logs_id);


--
-- Name: payload_locked_documents_rels_email_templates_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_email_templates_id_idx ON public.payload_locked_documents_rels USING btree (email_templates_id);


--
-- Name: payload_locked_documents_rels_form_submissions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_form_submissions_id_idx ON public.payload_locked_documents_rels USING btree (form_submissions_id);


--
-- Name: payload_locked_documents_rels_forms_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_forms_id_idx ON public.payload_locked_documents_rels USING btree (forms_id);


--
-- Name: payload_locked_documents_rels_licenses_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_licenses_id_idx ON public.payload_locked_documents_rels USING btree (licenses_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_orders_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_orders_id_idx ON public.payload_locked_documents_rels USING btree (orders_id);


--
-- Name: payload_locked_documents_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_pages_id_idx ON public.payload_locked_documents_rels USING btree (pages_id);


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_payment_transactions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_payment_transactions_id_idx ON public.payload_locked_documents_rels USING btree (payment_transactions_id);


--
-- Name: payload_locked_documents_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_products_id_idx ON public.payload_locked_documents_rels USING btree (products_id);


--
-- Name: payload_locked_documents_rels_promo_banners_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_promo_banners_id_idx ON public.payload_locked_documents_rels USING btree (promo_banners_id);


--
-- Name: payload_locked_documents_rels_stock_ledger_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_stock_ledger_id_idx ON public.payload_locked_documents_rels USING btree (stock_ledger_id);


--
-- Name: payload_locked_documents_rels_stock_reservations_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_stock_reservations_id_idx ON public.payload_locked_documents_rels USING btree (stock_reservations_id);


--
-- Name: payload_locked_documents_rels_support_messages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_support_messages_id_idx ON public.payload_locked_documents_rels USING btree (support_messages_id);


--
-- Name: payload_locked_documents_rels_support_tickets_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_support_tickets_id_idx ON public.payload_locked_documents_rels USING btree (support_tickets_id);


--
-- Name: payload_locked_documents_rels_testimonials_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_testimonials_id_idx ON public.payload_locked_documents_rels USING btree (testimonials_id);


--
-- Name: payload_locked_documents_rels_transactions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_transactions_id_idx ON public.payload_locked_documents_rels USING btree (transactions_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_rels_variant_options_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_variant_options_id_idx ON public.payload_locked_documents_rels USING btree (variant_options_id);


--
-- Name: payload_locked_documents_rels_variant_types_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_variant_types_id_idx ON public.payload_locked_documents_rels USING btree (variant_types_id);


--
-- Name: payload_locked_documents_rels_variants_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_variants_id_idx ON public.payload_locked_documents_rels USING btree (variants_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: payment_transactions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_transactions_created_at_idx ON public.payment_transactions USING btree (created_at);


--
-- Name: payment_transactions_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_transactions_customer_idx ON public.payment_transactions USING btree (customer_id);


--
-- Name: payment_transactions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_transactions_order_idx ON public.payment_transactions USING btree (order_id);


--
-- Name: payment_transactions_provider_transaction_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_transactions_provider_transaction_id_idx ON public.payment_transactions USING btree (provider_transaction_id);


--
-- Name: payment_transactions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payment_transactions_updated_at_idx ON public.payment_transactions USING btree (updated_at);


--
-- Name: products__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products__status_idx ON public.products USING btree (_status);


--
-- Name: products_blocks_content_columns_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_content_columns_order_idx ON public.products_blocks_content_columns USING btree (_order);


--
-- Name: products_blocks_content_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_content_columns_parent_id_idx ON public.products_blocks_content_columns USING btree (_parent_id);


--
-- Name: products_blocks_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_content_order_idx ON public.products_blocks_content USING btree (_order);


--
-- Name: products_blocks_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_content_parent_id_idx ON public.products_blocks_content USING btree (_parent_id);


--
-- Name: products_blocks_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_content_path_idx ON public.products_blocks_content USING btree (_path);


--
-- Name: products_blocks_cta_links_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_cta_links_order_idx ON public.products_blocks_cta_links USING btree (_order);


--
-- Name: products_blocks_cta_links_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_cta_links_parent_id_idx ON public.products_blocks_cta_links USING btree (_parent_id);


--
-- Name: products_blocks_cta_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_cta_order_idx ON public.products_blocks_cta USING btree (_order);


--
-- Name: products_blocks_cta_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_cta_parent_id_idx ON public.products_blocks_cta USING btree (_parent_id);


--
-- Name: products_blocks_cta_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_cta_path_idx ON public.products_blocks_cta USING btree (_path);


--
-- Name: products_blocks_media_block_media_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_media_block_media_idx ON public.products_blocks_media_block USING btree (media_id);


--
-- Name: products_blocks_media_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_media_block_order_idx ON public.products_blocks_media_block USING btree (_order);


--
-- Name: products_blocks_media_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_media_block_parent_id_idx ON public.products_blocks_media_block USING btree (_parent_id);


--
-- Name: products_blocks_media_block_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_blocks_media_block_path_idx ON public.products_blocks_media_block USING btree (_path);


--
-- Name: products_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_created_at_idx ON public.products USING btree (created_at);


--
-- Name: products_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_deleted_at_idx ON public.products USING btree (deleted_at);


--
-- Name: products_gallery_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_gallery_image_idx ON public.products_gallery USING btree (image_id);


--
-- Name: products_gallery_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_gallery_order_idx ON public.products_gallery USING btree (_order);


--
-- Name: products_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_gallery_parent_id_idx ON public.products_gallery USING btree (_parent_id);


--
-- Name: products_gallery_variant_option_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_gallery_variant_option_idx ON public.products_gallery USING btree (variant_option_id);


--
-- Name: products_included_files_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_included_files_order_idx ON public.products_included_files USING btree (_order);


--
-- Name: products_included_files_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_included_files_parent_id_idx ON public.products_included_files USING btree (_parent_id);


--
-- Name: products_meta_meta_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_meta_meta_image_idx ON public.products USING btree (meta_image_id);


--
-- Name: products_product_f_a_q_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_product_f_a_q_order_idx ON public.products_product_f_a_q USING btree (_order);


--
-- Name: products_product_f_a_q_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_product_f_a_q_parent_id_idx ON public.products_product_f_a_q USING btree (_parent_id);


--
-- Name: products_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_categories_id_idx ON public.products_rels USING btree (categories_id);


--
-- Name: products_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_order_idx ON public.products_rels USING btree ("order");


--
-- Name: products_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_pages_id_idx ON public.products_rels USING btree (pages_id);


--
-- Name: products_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_parent_idx ON public.products_rels USING btree (parent_id);


--
-- Name: products_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_path_idx ON public.products_rels USING btree (path);


--
-- Name: products_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_products_id_idx ON public.products_rels USING btree (products_id);


--
-- Name: products_rels_variant_types_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_rels_variant_types_id_idx ON public.products_rels USING btree (variant_types_id);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_updated_at_idx ON public.products USING btree (updated_at);


--
-- Name: promo_banners_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX promo_banners_created_at_idx ON public.promo_banners USING btree (created_at);


--
-- Name: promo_banners_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX promo_banners_image_idx ON public.promo_banners USING btree (image_id);


--
-- Name: promo_banners_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX promo_banners_updated_at_idx ON public.promo_banners USING btree (updated_at);


--
-- Name: settings_favicon_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_favicon_idx ON public.settings USING btree (favicon_id);


--
-- Name: settings_legal_pages_legal_pages_privacy_page_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_legal_pages_legal_pages_privacy_page_idx ON public.settings USING btree (legal_pages_privacy_page_id);


--
-- Name: settings_legal_pages_legal_pages_refund_page_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_legal_pages_legal_pages_refund_page_idx ON public.settings USING btree (legal_pages_refund_page_id);


--
-- Name: settings_legal_pages_legal_pages_terms_page_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_legal_pages_legal_pages_terms_page_idx ON public.settings USING btree (legal_pages_terms_page_id);


--
-- Name: settings_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_logo_idx ON public.settings USING btree (logo_id);


--
-- Name: settings_trust_badges_partner_logos_logo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_trust_badges_partner_logos_logo_idx ON public.settings_trust_badges_partner_logos USING btree (logo_id);


--
-- Name: settings_trust_badges_partner_logos_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_trust_badges_partner_logos_order_idx ON public.settings_trust_badges_partner_logos USING btree (_order);


--
-- Name: settings_trust_badges_partner_logos_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_trust_badges_partner_logos_parent_id_idx ON public.settings_trust_badges_partner_logos USING btree (_parent_id);


--
-- Name: stock_ledger_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_created_at_idx ON public.stock_ledger USING btree (created_at);


--
-- Name: stock_ledger_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_customer_idx ON public.stock_ledger USING btree (customer_id);


--
-- Name: stock_ledger_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_order_idx ON public.stock_ledger USING btree (order_id);


--
-- Name: stock_ledger_performed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_performed_by_idx ON public.stock_ledger USING btree (performed_by_id);


--
-- Name: stock_ledger_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_product_idx ON public.stock_ledger USING btree (product_id);


--
-- Name: stock_ledger_reference_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_reference_id_idx ON public.stock_ledger USING btree (reference_id);


--
-- Name: stock_ledger_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_type_idx ON public.stock_ledger USING btree (type);


--
-- Name: stock_ledger_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_updated_at_idx ON public.stock_ledger USING btree (updated_at);


--
-- Name: stock_ledger_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_ledger_variant_idx ON public.stock_ledger USING btree (variant);


--
-- Name: stock_reservations_cart_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_cart_id_idx ON public.stock_reservations USING btree (cart_id);


--
-- Name: stock_reservations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_created_at_idx ON public.stock_reservations USING btree (created_at);


--
-- Name: stock_reservations_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_customer_idx ON public.stock_reservations USING btree (customer_id);


--
-- Name: stock_reservations_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_expires_at_idx ON public.stock_reservations USING btree (expires_at);


--
-- Name: stock_reservations_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_order_idx ON public.stock_reservations USING btree (order_id);


--
-- Name: stock_reservations_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_product_idx ON public.stock_reservations USING btree (product_id);


--
-- Name: stock_reservations_reservation_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_reservation_id_idx ON public.stock_reservations USING btree (reservation_id);


--
-- Name: stock_reservations_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_status_idx ON public.stock_reservations USING btree (status);


--
-- Name: stock_reservations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_updated_at_idx ON public.stock_reservations USING btree (updated_at);


--
-- Name: stock_reservations_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stock_reservations_variant_idx ON public.stock_reservations USING btree (variant);


--
-- Name: support_messages_attachments_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_attachments_file_idx ON public.support_messages_attachments USING btree (file_id);


--
-- Name: support_messages_attachments_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_attachments_order_idx ON public.support_messages_attachments USING btree (_order);


--
-- Name: support_messages_attachments_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_attachments_parent_id_idx ON public.support_messages_attachments USING btree (_parent_id);


--
-- Name: support_messages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_created_at_idx ON public.support_messages USING btree (created_at);


--
-- Name: support_messages_sender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_sender_idx ON public.support_messages USING btree (sender_id);


--
-- Name: support_messages_ticket_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_ticket_idx ON public.support_messages USING btree (ticket_id);


--
-- Name: support_messages_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_messages_updated_at_idx ON public.support_messages USING btree (updated_at);


--
-- Name: support_tickets_assigned_to_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_assigned_to_idx ON public.support_tickets USING btree (assigned_to_id);


--
-- Name: support_tickets_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_created_at_idx ON public.support_tickets USING btree (created_at);


--
-- Name: support_tickets_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_customer_idx ON public.support_tickets USING btree (customer_id);


--
-- Name: support_tickets_related_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_related_order_idx ON public.support_tickets USING btree (related_order_id);


--
-- Name: support_tickets_related_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_related_product_idx ON public.support_tickets USING btree (related_product_id);


--
-- Name: support_tickets_ticket_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX support_tickets_ticket_number_idx ON public.support_tickets USING btree (ticket_number);


--
-- Name: support_tickets_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX support_tickets_updated_at_idx ON public.support_tickets USING btree (updated_at);


--
-- Name: testimonials_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_avatar_idx ON public.testimonials USING btree (avatar_id);


--
-- Name: testimonials_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_created_at_idx ON public.testimonials USING btree (created_at);


--
-- Name: testimonials_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX testimonials_updated_at_idx ON public.testimonials USING btree (updated_at);


--
-- Name: transactions_cart_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_cart_idx ON public.transactions USING btree (cart_id);


--
-- Name: transactions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_created_at_idx ON public.transactions USING btree (created_at);


--
-- Name: transactions_customer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_customer_idx ON public.transactions USING btree (customer_id);


--
-- Name: transactions_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_items_order_idx ON public.transactions_items USING btree (_order);


--
-- Name: transactions_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_items_parent_id_idx ON public.transactions_items USING btree (_parent_id);


--
-- Name: transactions_items_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_items_product_idx ON public.transactions_items USING btree (product_id);


--
-- Name: transactions_items_variant_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_items_variant_idx ON public.transactions_items USING btree (variant_id);


--
-- Name: transactions_nowpayments_nowpayments_nowpayments_payment_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX transactions_nowpayments_nowpayments_nowpayments_payment_idx ON public.transactions USING btree (nowpayments_nowpayments_payment_i_d);


--
-- Name: transactions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_order_idx ON public.transactions USING btree (order_id);


--
-- Name: transactions_pakasir_pakasir_pakasir_order_i_d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX transactions_pakasir_pakasir_pakasir_order_i_d_idx ON public.transactions USING btree (pakasir_pakasir_order_i_d);


--
-- Name: transactions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX transactions_updated_at_idx ON public.transactions USING btree (updated_at);


--
-- Name: users_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_avatar_idx ON public.users USING btree (avatar_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_google_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_google_id_idx ON public.users USING btree (google_id);


--
-- Name: users_roles_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_roles_order_idx ON public.users_roles USING btree ("order");


--
-- Name: users_roles_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_roles_parent_idx ON public.users_roles USING btree (parent_id);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: variant_options__variantoptions_options_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_options__variantoptions_options_order_idx ON public.variant_options USING btree (_variantoptions_options_order);


--
-- Name: variant_options_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_options_created_at_idx ON public.variant_options USING btree (created_at);


--
-- Name: variant_options_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_options_deleted_at_idx ON public.variant_options USING btree (deleted_at);


--
-- Name: variant_options_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_options_updated_at_idx ON public.variant_options USING btree (updated_at);


--
-- Name: variant_options_variant_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_options_variant_type_idx ON public.variant_options USING btree (variant_type_id);


--
-- Name: variant_types_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_types_created_at_idx ON public.variant_types USING btree (created_at);


--
-- Name: variant_types_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_types_deleted_at_idx ON public.variant_types USING btree (deleted_at);


--
-- Name: variant_types_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variant_types_updated_at_idx ON public.variant_types USING btree (updated_at);


--
-- Name: variants__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants__status_idx ON public.variants USING btree (_status);


--
-- Name: variants_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_created_at_idx ON public.variants USING btree (created_at);


--
-- Name: variants_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_deleted_at_idx ON public.variants USING btree (deleted_at);


--
-- Name: variants_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_product_idx ON public.variants USING btree (product_id);


--
-- Name: variants_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_rels_order_idx ON public.variants_rels USING btree ("order");


--
-- Name: variants_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_rels_parent_idx ON public.variants_rels USING btree (parent_id);


--
-- Name: variants_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_rels_path_idx ON public.variants_rels USING btree (path);


--
-- Name: variants_rels_variant_options_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_rels_variant_options_id_idx ON public.variants_rels USING btree (variant_options_id);


--
-- Name: variants_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX variants_updated_at_idx ON public.variants USING btree (updated_at);


--
-- Name: _pages_v_blocks_archive _pages_v_blocks_archive_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_archive
    ADD CONSTRAINT _pages_v_blocks_archive_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_banner _pages_v_blocks_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_banner
    ADD CONSTRAINT _pages_v_blocks_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_carousel _pages_v_blocks_carousel_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_carousel
    ADD CONSTRAINT _pages_v_blocks_carousel_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_content_columns _pages_v_blocks_content_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content_columns
    ADD CONSTRAINT _pages_v_blocks_content_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v_blocks_content(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_content _pages_v_blocks_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_content
    ADD CONSTRAINT _pages_v_blocks_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_cta_links _pages_v_blocks_cta_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta_links
    ADD CONSTRAINT _pages_v_blocks_cta_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v_blocks_cta(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_cta _pages_v_blocks_cta_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_cta
    ADD CONSTRAINT _pages_v_blocks_cta_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_form_block _pages_v_blocks_form_block_form_id_forms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_form_block
    ADD CONSTRAINT _pages_v_blocks_form_block_form_id_forms_id_fk FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE SET NULL;


--
-- Name: _pages_v_blocks_form_block _pages_v_blocks_form_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_form_block
    ADD CONSTRAINT _pages_v_blocks_form_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_media_block _pages_v_blocks_media_block_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_media_block
    ADD CONSTRAINT _pages_v_blocks_media_block_media_id_media_id_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _pages_v_blocks_media_block _pages_v_blocks_media_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_media_block
    ADD CONSTRAINT _pages_v_blocks_media_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_blocks_three_item_grid _pages_v_blocks_three_item_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_blocks_three_item_grid
    ADD CONSTRAINT _pages_v_blocks_three_item_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v _pages_v_parent_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_parent_id_pages_id_fk FOREIGN KEY (parent_id) REFERENCES public.pages(id) ON DELETE SET NULL;


--
-- Name: _pages_v_rels _pages_v_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: _pages_v_rels _pages_v_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: _pages_v_rels _pages_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v_rels _pages_v_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_rels
    ADD CONSTRAINT _pages_v_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: _pages_v_version_hero_links _pages_v_version_hero_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v_version_hero_links
    ADD CONSTRAINT _pages_v_version_hero_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;


--
-- Name: _pages_v _pages_v_version_hero_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_version_hero_media_id_media_id_fk FOREIGN KEY (version_hero_media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _pages_v _pages_v_version_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._pages_v
    ADD CONSTRAINT _pages_v_version_meta_image_id_media_id_fk FOREIGN KEY (version_meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _products_v_blocks_content_columns _products_v_blocks_content_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content_columns
    ADD CONSTRAINT _products_v_blocks_content_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v_blocks_content(id) ON DELETE CASCADE;


--
-- Name: _products_v_blocks_content _products_v_blocks_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_content
    ADD CONSTRAINT _products_v_blocks_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v_blocks_cta_links _products_v_blocks_cta_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta_links
    ADD CONSTRAINT _products_v_blocks_cta_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v_blocks_cta(id) ON DELETE CASCADE;


--
-- Name: _products_v_blocks_cta _products_v_blocks_cta_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_cta
    ADD CONSTRAINT _products_v_blocks_cta_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v_blocks_media_block _products_v_blocks_media_block_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_media_block
    ADD CONSTRAINT _products_v_blocks_media_block_media_id_media_id_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _products_v_blocks_media_block _products_v_blocks_media_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_blocks_media_block
    ADD CONSTRAINT _products_v_blocks_media_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v _products_v_parent_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v
    ADD CONSTRAINT _products_v_parent_id_products_id_fk FOREIGN KEY (parent_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: _products_v_rels _products_v_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: _products_v_rels _products_v_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: _products_v_rels _products_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v_rels _products_v_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: _products_v_rels _products_v_rels_variant_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_rels
    ADD CONSTRAINT _products_v_rels_variant_types_fk FOREIGN KEY (variant_types_id) REFERENCES public.variant_types(id) ON DELETE CASCADE;


--
-- Name: _products_v_version_gallery _products_v_version_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_gallery
    ADD CONSTRAINT _products_v_version_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _products_v_version_gallery _products_v_version_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_gallery
    ADD CONSTRAINT _products_v_version_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v_version_gallery _products_v_version_gallery_variant_option_id_variant_options_i; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_gallery
    ADD CONSTRAINT _products_v_version_gallery_variant_option_id_variant_options_i FOREIGN KEY (variant_option_id) REFERENCES public.variant_options(id) ON DELETE SET NULL;


--
-- Name: _products_v_version_included_files _products_v_version_included_files_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_included_files
    ADD CONSTRAINT _products_v_version_included_files_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _products_v _products_v_version_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v
    ADD CONSTRAINT _products_v_version_meta_image_id_media_id_fk FOREIGN KEY (version_meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _products_v_version_product_f_a_q _products_v_version_product_f_a_q_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._products_v_version_product_f_a_q
    ADD CONSTRAINT _products_v_version_product_f_a_q_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._products_v(id) ON DELETE CASCADE;


--
-- Name: _variants_v _variants_v_parent_id_variants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v
    ADD CONSTRAINT _variants_v_parent_id_variants_id_fk FOREIGN KEY (parent_id) REFERENCES public.variants(id) ON DELETE SET NULL;


--
-- Name: _variants_v_rels _variants_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v_rels
    ADD CONSTRAINT _variants_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._variants_v(id) ON DELETE CASCADE;


--
-- Name: _variants_v_rels _variants_v_rels_variant_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v_rels
    ADD CONSTRAINT _variants_v_rels_variant_options_fk FOREIGN KEY (variant_options_id) REFERENCES public.variant_options(id) ON DELETE CASCADE;


--
-- Name: _variants_v _variants_v_version_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._variants_v
    ADD CONSTRAINT _variants_v_version_product_id_products_id_fk FOREIGN KEY (version_product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: addresses addresses_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: carts carts_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: carts_items carts_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: carts_items carts_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: carts_items carts_items_variant_id_variants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts_items
    ADD CONSTRAINT carts_items_variant_id_variants_id_fk FOREIGN KEY (variant_id) REFERENCES public.variants(id) ON DELETE SET NULL;


--
-- Name: checkout_sessions checkout_sessions_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkout_sessions
    ADD CONSTRAINT checkout_sessions_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: checkout_sessions checkout_sessions_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checkout_sessions
    ADD CONSTRAINT checkout_sessions_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: coupons_allowed_tiers coupons_allowed_tiers_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons_allowed_tiers
    ADD CONSTRAINT coupons_allowed_tiers_parent_fk FOREIGN KEY (parent_id) REFERENCES public.coupons(id) ON DELETE CASCADE;


--
-- Name: digital_assets digital_assets_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_assets
    ADD CONSTRAINT digital_assets_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: digital_assets digital_assets_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_assets
    ADD CONSTRAINT digital_assets_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: digital_stock_units digital_stock_units_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units
    ADD CONSTRAINT digital_stock_units_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: digital_stock_units digital_stock_units_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units
    ADD CONSTRAINT digital_stock_units_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: digital_stock_units digital_stock_units_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units
    ADD CONSTRAINT digital_stock_units_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: digital_stock_units digital_stock_units_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.digital_stock_units
    ADD CONSTRAINT digital_stock_units_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: download_access download_access_asset_id_digital_assets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access
    ADD CONSTRAINT download_access_asset_id_digital_assets_id_fk FOREIGN KEY (asset_id) REFERENCES public.digital_assets(id) ON DELETE SET NULL;


--
-- Name: download_access download_access_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access
    ADD CONSTRAINT download_access_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: download_access download_access_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access
    ADD CONSTRAINT download_access_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: download_access download_access_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_access
    ADD CONSTRAINT download_access_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: download_logs download_logs_asset_id_digital_assets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs
    ADD CONSTRAINT download_logs_asset_id_digital_assets_id_fk FOREIGN KEY (asset_id) REFERENCES public.digital_assets(id) ON DELETE SET NULL;


--
-- Name: download_logs download_logs_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs
    ADD CONSTRAINT download_logs_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: download_logs download_logs_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs
    ADD CONSTRAINT download_logs_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: download_logs download_logs_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.download_logs
    ADD CONSTRAINT download_logs_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: footer_nav_items footer_nav_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_nav_items
    ADD CONSTRAINT footer_nav_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.footer(id) ON DELETE CASCADE;


--
-- Name: footer_rels footer_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_rels
    ADD CONSTRAINT footer_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: footer_rels footer_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_rels
    ADD CONSTRAINT footer_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.footer(id) ON DELETE CASCADE;


--
-- Name: form_submissions form_submissions_form_id_forms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions
    ADD CONSTRAINT form_submissions_form_id_forms_id_fk FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE SET NULL;


--
-- Name: form_submissions_submission_data form_submissions_submission_data_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.form_submissions_submission_data
    ADD CONSTRAINT form_submissions_submission_data_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.form_submissions(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_checkbox forms_blocks_checkbox_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_checkbox
    ADD CONSTRAINT forms_blocks_checkbox_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_country forms_blocks_country_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_country
    ADD CONSTRAINT forms_blocks_country_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_email forms_blocks_email_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_email
    ADD CONSTRAINT forms_blocks_email_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_message forms_blocks_message_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_message
    ADD CONSTRAINT forms_blocks_message_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_number forms_blocks_number_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_number
    ADD CONSTRAINT forms_blocks_number_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_select_options forms_blocks_select_options_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_select_options
    ADD CONSTRAINT forms_blocks_select_options_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms_blocks_select(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_select forms_blocks_select_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_select
    ADD CONSTRAINT forms_blocks_select_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_state forms_blocks_state_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_state
    ADD CONSTRAINT forms_blocks_state_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_text forms_blocks_text_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_text
    ADD CONSTRAINT forms_blocks_text_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_blocks_textarea forms_blocks_textarea_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_blocks_textarea
    ADD CONSTRAINT forms_blocks_textarea_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: forms_emails forms_emails_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forms_emails
    ADD CONSTRAINT forms_emails_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: header_nav_items header_nav_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_nav_items
    ADD CONSTRAINT header_nav_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.header(id) ON DELETE CASCADE;


--
-- Name: header_rels header_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_rels
    ADD CONSTRAINT header_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: header_rels header_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.header_rels
    ADD CONSTRAINT header_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.header(id) ON DELETE CASCADE;


--
-- Name: licenses licenses_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: licenses licenses_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: licenses licenses_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: media media_uploaded_by_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploaded_by_id_users_id_fk FOREIGN KEY (uploaded_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: orders orders_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: orders_digital_deliveries orders_digital_deliveries_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries
    ADD CONSTRAINT orders_digital_deliveries_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders_digital_deliveries orders_digital_deliveries_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries
    ADD CONSTRAINT orders_digital_deliveries_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders_digital_deliveries_units orders_digital_deliveries_units_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries_units
    ADD CONSTRAINT orders_digital_deliveries_units_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: orders_digital_deliveries_units orders_digital_deliveries_units_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_digital_deliveries_units
    ADD CONSTRAINT orders_digital_deliveries_units_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.orders_digital_deliveries(id) ON DELETE CASCADE;


--
-- Name: orders_items orders_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders_items orders_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders_items orders_items_variant_id_variants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_variant_id_variants_id_fk FOREIGN KEY (variant_id) REFERENCES public.variants(id) ON DELETE SET NULL;


--
-- Name: orders_rels orders_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_rels
    ADD CONSTRAINT orders_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders_rels orders_rels_transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders_rels
    ADD CONSTRAINT orders_rels_transactions_fk FOREIGN KEY (transactions_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: orders orders_voucher_id_coupons_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_voucher_id_coupons_id_fk FOREIGN KEY (voucher_id) REFERENCES public.coupons(id) ON DELETE SET NULL;


--
-- Name: pages_blocks_archive pages_blocks_archive_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_archive
    ADD CONSTRAINT pages_blocks_archive_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_banner pages_blocks_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_banner
    ADD CONSTRAINT pages_blocks_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_carousel pages_blocks_carousel_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_carousel
    ADD CONSTRAINT pages_blocks_carousel_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_content_columns pages_blocks_content_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_content_columns
    ADD CONSTRAINT pages_blocks_content_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages_blocks_content(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_content pages_blocks_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_content
    ADD CONSTRAINT pages_blocks_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_cta_links pages_blocks_cta_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_cta_links
    ADD CONSTRAINT pages_blocks_cta_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages_blocks_cta(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_cta pages_blocks_cta_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_cta
    ADD CONSTRAINT pages_blocks_cta_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_form_block pages_blocks_form_block_form_id_forms_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_form_block
    ADD CONSTRAINT pages_blocks_form_block_form_id_forms_id_fk FOREIGN KEY (form_id) REFERENCES public.forms(id) ON DELETE SET NULL;


--
-- Name: pages_blocks_form_block pages_blocks_form_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_form_block
    ADD CONSTRAINT pages_blocks_form_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_media_block pages_blocks_media_block_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_media_block
    ADD CONSTRAINT pages_blocks_media_block_media_id_media_id_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: pages_blocks_media_block pages_blocks_media_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_media_block
    ADD CONSTRAINT pages_blocks_media_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_blocks_three_item_grid pages_blocks_three_item_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_blocks_three_item_grid
    ADD CONSTRAINT pages_blocks_three_item_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_hero_links pages_hero_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_hero_links
    ADD CONSTRAINT pages_hero_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages pages_hero_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_hero_media_id_media_id_fk FOREIGN KEY (hero_media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: pages pages_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: pages_rels pages_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: pages_rels pages_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages_rels
    ADD CONSTRAINT pages_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_addresses_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_addresses_fk FOREIGN KEY (addresses_id) REFERENCES public.addresses(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_carts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_carts_fk FOREIGN KEY (carts_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_checkout_sessions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_checkout_sessions_fk FOREIGN KEY (checkout_sessions_id) REFERENCES public.checkout_sessions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_coupons_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_coupons_fk FOREIGN KEY (coupons_id) REFERENCES public.coupons(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_digital_assets_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_digital_assets_fk FOREIGN KEY (digital_assets_id) REFERENCES public.digital_assets(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_digital_stock_units_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_digital_stock_units_fk FOREIGN KEY (digital_stock_units_id) REFERENCES public.digital_stock_units(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_download_access_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_download_access_fk FOREIGN KEY (download_access_id) REFERENCES public.download_access(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_download_logs_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_download_logs_fk FOREIGN KEY (download_logs_id) REFERENCES public.download_logs(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_email_templates_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_email_templates_fk FOREIGN KEY (email_templates_id) REFERENCES public.email_templates(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_form_submissions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_form_submissions_fk FOREIGN KEY (form_submissions_id) REFERENCES public.form_submissions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_forms_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_forms_fk FOREIGN KEY (forms_id) REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_licenses_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_licenses_fk FOREIGN KEY (licenses_id) REFERENCES public.licenses(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_orders_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_orders_fk FOREIGN KEY (orders_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_payment_transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_payment_transactions_fk FOREIGN KEY (payment_transactions_id) REFERENCES public.payment_transactions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_promo_banners_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_promo_banners_fk FOREIGN KEY (promo_banners_id) REFERENCES public.promo_banners(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_stock_ledger_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_stock_ledger_fk FOREIGN KEY (stock_ledger_id) REFERENCES public.stock_ledger(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_stock_reservations_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_stock_reservations_fk FOREIGN KEY (stock_reservations_id) REFERENCES public.stock_reservations(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_support_messages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_support_messages_fk FOREIGN KEY (support_messages_id) REFERENCES public.support_messages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_support_tickets_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_support_tickets_fk FOREIGN KEY (support_tickets_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_testimonials_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_testimonials_fk FOREIGN KEY (testimonials_id) REFERENCES public.testimonials(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_transactions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_transactions_fk FOREIGN KEY (transactions_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_variant_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_variant_options_fk FOREIGN KEY (variant_options_id) REFERENCES public.variant_options(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_variant_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_variant_types_fk FOREIGN KEY (variant_types_id) REFERENCES public.variant_types(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_variants_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_variants_fk FOREIGN KEY (variants_id) REFERENCES public.variants(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_transactions payment_transactions_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payment_transactions payment_transactions_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: products_blocks_content_columns products_blocks_content_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_content_columns
    ADD CONSTRAINT products_blocks_content_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products_blocks_content(id) ON DELETE CASCADE;


--
-- Name: products_blocks_content products_blocks_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_content
    ADD CONSTRAINT products_blocks_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_blocks_cta_links products_blocks_cta_links_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_cta_links
    ADD CONSTRAINT products_blocks_cta_links_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products_blocks_cta(id) ON DELETE CASCADE;


--
-- Name: products_blocks_cta products_blocks_cta_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_cta
    ADD CONSTRAINT products_blocks_cta_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_blocks_media_block products_blocks_media_block_media_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_media_block
    ADD CONSTRAINT products_blocks_media_block_media_id_media_id_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: products_blocks_media_block products_blocks_media_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_blocks_media_block
    ADD CONSTRAINT products_blocks_media_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_gallery products_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_gallery
    ADD CONSTRAINT products_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: products_gallery products_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_gallery
    ADD CONSTRAINT products_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_gallery products_gallery_variant_option_id_variant_options_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_gallery
    ADD CONSTRAINT products_gallery_variant_option_id_variant_options_id_fk FOREIGN KEY (variant_option_id) REFERENCES public.variant_options(id) ON DELETE SET NULL;


--
-- Name: products_included_files products_included_files_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_included_files
    ADD CONSTRAINT products_included_files_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_meta_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_meta_image_id_media_id_fk FOREIGN KEY (meta_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: products_product_f_a_q products_product_f_a_q_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_product_f_a_q
    ADD CONSTRAINT products_product_f_a_q_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_rels products_rels_variant_types_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_rels
    ADD CONSTRAINT products_rels_variant_types_fk FOREIGN KEY (variant_types_id) REFERENCES public.variant_types(id) ON DELETE CASCADE;


--
-- Name: promo_banners promo_banners_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promo_banners
    ADD CONSTRAINT promo_banners_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: settings settings_favicon_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_favicon_id_media_id_fk FOREIGN KEY (favicon_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: settings settings_legal_pages_privacy_page_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_legal_pages_privacy_page_id_pages_id_fk FOREIGN KEY (legal_pages_privacy_page_id) REFERENCES public.pages(id) ON DELETE SET NULL;


--
-- Name: settings settings_legal_pages_refund_page_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_legal_pages_refund_page_id_pages_id_fk FOREIGN KEY (legal_pages_refund_page_id) REFERENCES public.pages(id) ON DELETE SET NULL;


--
-- Name: settings settings_legal_pages_terms_page_id_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_legal_pages_terms_page_id_pages_id_fk FOREIGN KEY (legal_pages_terms_page_id) REFERENCES public.pages(id) ON DELETE SET NULL;


--
-- Name: settings settings_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: settings_trust_badges_partner_logos settings_trust_badges_partner_logos_logo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_trust_badges_partner_logos
    ADD CONSTRAINT settings_trust_badges_partner_logos_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: settings_trust_badges_partner_logos settings_trust_badges_partner_logos_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings_trust_badges_partner_logos
    ADD CONSTRAINT settings_trust_badges_partner_logos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.settings(id) ON DELETE CASCADE;


--
-- Name: stock_ledger stock_ledger_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: stock_ledger stock_ledger_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: stock_ledger stock_ledger_performed_by_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_performed_by_id_users_id_fk FOREIGN KEY (performed_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: stock_ledger stock_ledger_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_ledger
    ADD CONSTRAINT stock_ledger_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: stock_reservations stock_reservations_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: stock_reservations stock_reservations_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: stock_reservations stock_reservations_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_reservations
    ADD CONSTRAINT stock_reservations_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: support_messages_attachments support_messages_attachments_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages_attachments
    ADD CONSTRAINT support_messages_attachments_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: support_messages_attachments support_messages_attachments_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages_attachments
    ADD CONSTRAINT support_messages_attachments_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.support_messages(id) ON DELETE CASCADE;


--
-- Name: support_messages support_messages_sender_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_sender_id_users_id_fk FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: support_messages support_messages_ticket_id_support_tickets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_messages
    ADD CONSTRAINT support_messages_ticket_id_support_tickets_id_fk FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_assigned_to_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_id_users_id_fk FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_related_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_related_order_id_orders_id_fk FOREIGN KEY (related_order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_related_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_related_product_id_products_id_fk FOREIGN KEY (related_product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: testimonials testimonials_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_cart_id_carts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_cart_id_carts_id_fk FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_customer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_customer_id_users_id_fk FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: transactions_items transactions_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_items
    ADD CONSTRAINT transactions_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: transactions_items transactions_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_items
    ADD CONSTRAINT transactions_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: transactions_items transactions_items_variant_id_variants_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions_items
    ADD CONSTRAINT transactions_items_variant_id_variants_id_fk FOREIGN KEY (variant_id) REFERENCES public.variants(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: users users_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_roles users_roles_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_parent_fk FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: variant_options variant_options_variant_type_id_variant_types_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variant_options
    ADD CONSTRAINT variant_options_variant_type_id_variant_types_id_fk FOREIGN KEY (variant_type_id) REFERENCES public.variant_types(id) ON DELETE SET NULL;


--
-- Name: variants variants_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: variants_rels variants_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants_rels
    ADD CONSTRAINT variants_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.variants(id) ON DELETE CASCADE;


--
-- Name: variants_rels variants_rels_variant_options_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variants_rels
    ADD CONSTRAINT variants_rels_variant_options_fk FOREIGN KEY (variant_options_id) REFERENCES public.variant_options(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 0kp2XKzIhVej66QbO6ceeJEAurMgn7ci7mCAdJ2IkaVkN2K6ShufCeqnrEXxbqE

