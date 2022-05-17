import { query } from '../models/db';
import { datas } from './datas';

export async function initData() {
  try {
    const results = await Promise.all([
      query(`insert into user (id) values (?)`, [datas.userId]),
      query(
        `insert into review (id, user_id, place_id, content) values (?, ?, ?, ?)`,
        [datas.reviewId, datas.userId, datas.placeId, datas.content]
      ),
      query(`insert into review_photo (id, review_id) values (?, ?)`, [
        datas.attachedPhotoIds[0],
        datas.reviewId,
      ]),
      query(`insert into review_photo (id, review_id) values (?, ?)`, [
        datas.attachedPhotoIds[1],
        datas.reviewId,
      ]),
      query(`insert into place (id) values (?)`, [datas.placeId]),
    ]);
    console.log(results);
    console.log(`initialize data 완료`);
  } catch (error) {
    console.log(`initData error: ${error}`);
    throw error;
  }
}

export async function dropTables() {
  try {
    const results = await Promise.all([
      query(`drop table if exists user`),
      query(`drop table if exists place`),
      query(`drop table if exists review`),
      query(`drop table if exists review_photo`),
      query(`drop table if exists point`),
    ]);
    console.log(`drop tables 완료`);
    return true;
  } catch (error) {
    console.log(`drop tables error: ${error}`);
    throw error;
  }
}

export async function createTables() {
  try {
    const promises = [
      query(`create table if not exists user (
      id varchar(32) not null primary key
    )`),

      query(`create table if not exists place (
      id varchar(32) not null primary key
    )`),

      query(`create table if not exists review (
      id varchar(32) not null primary key,
      user_id varchar(32) not null,
      place_id varchar(32) not null,
      content text not null,
      created_at datetime not null default current_timestamp,
      modified_at datetime on update current_timestamp
    )`),

      query(`create table if not exists review_photo (
      id varchar(32) not null primary key,
      review_id varchar(32) not null,
      created_at datetime not null default current_timestamp
    )`),

      query(`create table if not exists point (
      id varchar(32) not null primary key,
      user_id varchar(32) not null,
      review_type varchar(10), -- TEXT, PHOTO, BONUS
      review_id varchar(32) not null, -- uuid
      amount int not null,
      created_at datetime not null default current_timestamp
    )`),

      query(`create index idx_userid on point (user_id)`),
      query(`create index idx_reviewid on point (review_id)`),
      query(`create index idx_placeid on review (place_id)`),
    ];

    const results = await Promise.all(promises);
    console.log('create tables 완료');
    return true;
  } catch (error) {
    console.log(`create tables error: ${error}`);
    throw error;
  }
}
