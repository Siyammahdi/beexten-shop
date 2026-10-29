alter table orders
  add column if not exists invoice_html text not null default '';
