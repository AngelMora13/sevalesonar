ALTER TABLE `products` ADD `image_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `image_size` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `image_mime` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `featured_label` text DEFAULT 'Especialidad de la casa';--> statement-breakpoint
ALTER TABLE `products` ADD `featured_description` text DEFAULT 'Horneados frescos cada mañana';