export class ResponseResult {
  error: any;
  result!: any;
}

export class ListResponse extends ResponseResult {
  count: number | undefined;
}
