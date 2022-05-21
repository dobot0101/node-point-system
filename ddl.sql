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
  modified_at datetime on update current_timestamp,
  key idx_placeid (place_id)
);

create table if not exists review_photo (
  id varchar(32) not null primary key,
  review_id varchar(32) not null,
  created_at datetime not null default current_timestamp
);

create table if not exists point (
  id varchar(32) not null primary key,
  user_id varchar(32) not null,
  memo varchar(20), -- TEXT, PHOTO, BONUS ...
  source_type varchar(20) not null, -- REVIEW ...
  source_id varchar(32) not null, -- uuid
  amount int not null, -- e.g. 양수: 적립, 음수: 취소
  created_at datetime not null default current_timestamp,
  key idx_userid (user_id),
  key idx_sourceid_sourcetype_memo (source_id, source_type, memo)
)
-- 
