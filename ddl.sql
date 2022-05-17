create table if not exists user (
  id varchar(32) not null primary key
);

create table if not exists place (
  id varchar(32) not null primary key
);

create table if not exists review (
  id varchar(32) not null primary key,
  user_id varchar(32) not null,
  place_id varchar(32) not null,
  content text not null,
  created_at datetime not null default current_timestamp,
  modified_at datetime on update current_timestamp
);

create table if not exists review_photo (
  id varchar(32) not null primary key,
  review_id varchar(32) not null,
  created_at datetime not null default current_timestamp
);

create table if not exists point (
  id varchar(32) not null primary key,
  user_id varchar(32) not null,
  review_type varchar(10), -- TEXT, PHOTO, BONUS
  review_id varchar(32) not null, -- uuid
  amount int not null,
  created_at datetime not null default current_timestamp
);
-- 

-- 인덱스 생성
create index idx_userid on point (user_id);
create index idx_reviewid on point (review_id);
create index idx_placeid on review (place_id);
