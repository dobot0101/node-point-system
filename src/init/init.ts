import { query } from '../models/db';
import { datas } from './datas';

export async function createTestDB() {
  return await query(`create database point_test`);
}

export async function dropTestDB() {
  return await query(`drop database point_test`);
}

export async function initData() {
  try {
    const results = await Promise.all([
      query(`insert into user (id) values (?)`, [datas.userId]),
      query(`insert into review (id, user_id, place_id, content) values (?, ?, ?, ?)`, [
        datas.reviewId,
        datas.userId,
        datas.placeId,
        datas.content,
      ]),
      query(`insert into review_photo (id, review_id) values (?, ?)`, [datas.attachedPhotoIds[0], datas.reviewId]),
      query(`insert into review_photo (id, review_id) values (?, ?)`, [datas.attachedPhotoIds[1], datas.reviewId]),
      query(`insert into place (id) values (?)`, [datas.placeId]),
    ]);
    console.log(`data init complete`);
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
    console.log(`tables drop complete`);
    return true;
  } catch (error) {
    console.log(`tables drop error: ${error}`);
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
      modified_at datetime on update current_timestamp,
      key idx_placeid (place_id)
    )`),

      query(`create table if not exists review_photo (
      id varchar(32) not null primary key,
      review_id varchar(32) not null,
      created_at datetime not null default current_timestamp
    )`),

      query(`create table if not exists point (
      id varchar(32) not null primary key,
      user_id varchar(32) not null,
      memo varchar(20), -- TEXT, PHOTO, BONUS
      source_type varchar(20) not null,
      source_id varchar(32) not null, -- uuid
      amount int not null,
      created_at datetime not null default current_timestamp,
      key idx_userid (user_id),
      key idx_sourceid_sourcetype_memo (source_id, source_type, memo)
    )`),
    ];

    const results = await Promise.all(promises);

    console.log('table create complete');
    return true;
  } catch (error) {
    console.log(`table create error: ${error}`);
    throw error;
  }
}

// 위의 테이블 생성 시 인덱스를 같이 생성하도록 변경
// export async function createIndexes() {
//   const promises = [
//     query(`create index idx_userid on point (user_id)`),
//     query(`create index idx_reviewid on point (review_id)`),
//     query(`create index idx_placeid on review (place_id)`),
//   ];

//   const result = await Promise.all(promises);
//   console.log(`create index complete`);
//   return result;
// }

// export async function dropIndexes() {
//   const promises = [
//     query(`alter table point drop index idx_userid`),
//     query(`alter table point drop index idx_reviewid`),
//     query(`alter table review drop index idx_placeid`),
//   ];

//   const result = await Promise.all(promises);
//   console.log('drop index complete');
//   return result;
// }
