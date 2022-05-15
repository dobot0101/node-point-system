create table if not exists user (
  id varchar(36) not null primary key
);

create table if not exists place (
  id varchar(36) not null primary key
);

create table if not exists review (
  id varchar(36) not null primary key,
  user_id varchar(36) not null,
  place_id varchar(36) not null,
  content text not null,
  created_at datetime not null default current_timestamp,
  modified_at datetime on update current_timestamp
);

create table if not exists review_photo (
  id varchar(36) not null primary key,
  review_id varchar(36) not null,
  created_at datetime not null default current_timestamp
);

create table if not exists point (
  id varchar(36) not null primary key,
  user_id varchar(36) not null,
  review_type varchar(10), -- TEXT, PHOTO, BONUS
  review_id varchar(36) not null, -- uuid
  amount int not null,
  is_used boolean not null default false,
  created_at datetime not null default current_timestamp
);
-- 
select user_id, sum(amount) from point where user_id = 123 and is_used = false group by user_id
create index idx_userid on point(user_id);