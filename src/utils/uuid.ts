import v4 from 'uuid4';

/**
 * UUID를 생성한 그대로 DB에 저장하면 인덱스가 비정상적으로 커지고 검색 성능도 떨어진다고 합니다.
 * 아래의 바법으로 UUID의 구조를 1-2-3-4-5 에서 32145로 변경해서 사용하면
 * 인덱싱이 가능한 순서를 어느정도 보장받을 수 있다고 하여 적용하였습니다.
 *
 * @returns UUID
 */
function generateUUID(): string {
  const tokens = v4().split('-');
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
}

export { generateUUID };
