import { Route, UrlSegment, UrlSegmentGroup } from '@angular/router';

export function languagePrefixMatcher() {
  return (
    segments: UrlSegment[],
    segmentGroup: UrlSegmentGroup,
    route: Route) => {
    const consumed: UrlSegment[] = [];
    const params: {[index: string]: UrlSegment} = {};
    if(segments.length > 0) {
      const firstSegment = segments[0];
      const match = /^([a-zA-Z]{2,3}):([a-zA-Z]{2,3})$/.exec(firstSegment.path);
      if(match) {
        consumed.push(firstSegment);
        params['uiLanguage'] = new UrlSegment(match[1], {});
        params['endangeredLanguage'] = new UrlSegment(match[2], {});
      }
    }
    return { consumed, posParams: params };
  };
}
