import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const scores = mysqlTable('scores', {
  id: int('id').primaryKey().autoincrement(),
  pseudo: varchar('pseudo', { length: 100 }).notNull(),
  score: int('score').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});