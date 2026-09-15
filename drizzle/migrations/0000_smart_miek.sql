CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(30) NOT NULL,
	`description` text(500) DEFAULT '' NOT NULL,
	`price` text DEFAULT '' NOT NULL,
	`show_price` integer DEFAULT true NOT NULL,
	`category` text DEFAULT 'ponquesitos' NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`image_key` text DEFAULT '' NOT NULL,
	`image_size` integer DEFAULT 0 NOT NULL,
	`image_mime` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
