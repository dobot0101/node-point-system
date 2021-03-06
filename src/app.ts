import express from 'express';
import events from './routes/events.route';
import points from './routes/points.route';
import members from './routes/members.route';
import { auth } from './middleware/auth';
// import { convertUUIDInRequestBody } from './middleware/convertRequestValue';

export const app = express();

app.use(express.json());

/**
 * 테스트하기 번거로울 것 같아 일단 주석처리하였습니다.
 * 만약 서버 시작 시 생성되는 토큰을 테스트하려면 아래의 코드를 주석 해제하고
 * 기존 코드(auth 미들웨어가 적용되지 않은)는 주석 처리하면 됩니다.
 */
// app.use('/events', auth, events);
// app.use('/points', auth, point);
app.use('/events', events);
app.use('/points', points);
app.use('/members', members);
