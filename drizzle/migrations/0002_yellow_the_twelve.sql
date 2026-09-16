CREATE INDEX IF NOT EXISTS `idx_products_active` ON `products` (`active`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_category` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_is_featured` ON `products` (`is_featured`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_products_order` ON `products` (`order_index`);