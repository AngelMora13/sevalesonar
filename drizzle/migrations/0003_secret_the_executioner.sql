DROP INDEX IF EXISTS `idx_products_active`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_products_category`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_products_is_featured`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_products_order`;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_active_order` ON `products` (`active`,`order_index`);