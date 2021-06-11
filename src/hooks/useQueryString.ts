/* eslint-disable consistent-return */
import { useState } from 'react';
import * as qs from 'qs';

const useQueryParams = (search: string, depth?: number) => {
  const parse = (): any => {
    return qs.parse(search, {
      ignoreQueryPrefix: true,
      depth: depth || 100,
      decoder(str: string) {
        if (/^([+-]?[0-9]\d*|0)$/u.test(str)) {
          return parseInt(str, 10);
        }
        if (str === 'false') {
          return false;
        }
        if (str === 'true') {
          return true;
        }
        return decodeURIComponent(str);
      },
    });
  };
  const [query] = useState(parse());
  return [query];
};

export default useQueryParams;
