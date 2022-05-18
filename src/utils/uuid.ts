import uuid4 from 'uuid4';
import v4 from 'uuid4';

function generateUUID(): string {
  return convertUUID(v4());
}

/**
 * UUID를 생성한 그대로 DB에 저장하면 인덱스가 비정상적으로 커지고 검색 성능도 떨어질 수 있다고 함.
 * 아래의 방법으로 UUID의 구조를 1-2-3-4-5 에서 32145로 변경하면,
 * 인덱싱을 보장 받을 수 있다고 하여 아래 함수 사용
 */
function convertUUID(uuid: string) {
  const tokens = uuid.split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

interface ConvertTargetObject {
  [key: string]: any;
}

function convertUUIDOfObject(object: ConvertTargetObject) {
  for (const [key, val] of Object.entries(object)) {
    if (val) {
      if (typeof val === 'string' && uuid4.valid(val)) {
        object[key] = convertUUID(val);
        continue;
      }

      if (Array.isArray(val)) {
        const convertedArr = val.map(item => {
          return uuid4.valid(item) ? convertUUID(item) : item;
        });
        object[key] = convertedArr;
        continue;
      }
    }
  }
}

export { generateUUID, convertUUID, convertUUIDOfObject };
