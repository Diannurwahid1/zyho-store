import * as migration_20260707_130840 from './20260707_130840';
import * as migration_20260712_102537_checkout_sessions_membership_points from './20260712_102537_checkout_sessions_membership_points';
import * as migration_20260712_234500_digital_stock_units from './20260712_234500_digital_stock_units';
import * as migration_20260713_004500_settings_commerce_enable_usd from './20260713_004500_settings_commerce_enable_usd';
import * as migration_20260714_145643 from './20260714_145643';
import * as migration_20260715_094745_waitlist_collections from './20260715_094745_waitlist_collections';
import * as migration_20260715_113749_coupons_applies_to from './20260715_113749_coupons_applies_to';
import * as migration_20260725_020850_signup_voucher_campaigns from './20260725_020850_signup_voucher_campaigns';

export const migrations = [
  {
    up: migration_20260707_130840.up,
    down: migration_20260707_130840.down,
    name: '20260707_130840',
  },
  {
    up: migration_20260712_102537_checkout_sessions_membership_points.up,
    down: migration_20260712_102537_checkout_sessions_membership_points.down,
    name: '20260712_102537_checkout_sessions_membership_points',
  },
  {
    up: migration_20260712_234500_digital_stock_units.up,
    down: migration_20260712_234500_digital_stock_units.down,
    name: '20260712_234500_digital_stock_units',
  },
  {
    up: migration_20260713_004500_settings_commerce_enable_usd.up,
    down: migration_20260713_004500_settings_commerce_enable_usd.down,
    name: '20260713_004500_settings_commerce_enable_usd',
  },
  {
    up: migration_20260714_145643.up,
    down: migration_20260714_145643.down,
    name: '20260714_145643',
  },
  {
    up: migration_20260715_094745_waitlist_collections.up,
    down: migration_20260715_094745_waitlist_collections.down,
    name: '20260715_094745_waitlist_collections',
  },
  {
    up: migration_20260715_113749_coupons_applies_to.up,
    down: migration_20260715_113749_coupons_applies_to.down,
    name: '20260715_113749_coupons_applies_to',
  },
  {
    up: migration_20260725_020850_signup_voucher_campaigns.up,
    down: migration_20260725_020850_signup_voucher_campaigns.down,
    name: '20260725_020850_signup_voucher_campaigns'
  },
];
