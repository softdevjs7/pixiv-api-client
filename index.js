/* eslint strict:0 */

'use strict';

const axios = require('axios');
const qs = require('qs');

const BASE_URL = 'https://app-api.pixiv.net';
const filter = 'for_ios';

function callApi(url, options) {
  const finalUrl = /\b(http|https)/.test(url) ? url : BASE_URL + url;
  return axios(finalUrl, options).then(res => res.data).catch(err => {
    if (err.response) {
      throw err.response.data;
    }
    else {
      throw err.message;
    }
  });
}

function serialize(obj) {
  return Object.keys(obj).reduce((a, k) => {
    a.push(`${k}=${encodeURIComponent(obj[k])}`);
    return a;
  }, []).join('&');
}

class PixivApi {
  login(username, password) {
    if (!username) {
      return Promise.reject(new Error('username required'));
    }
    if (!password) {
      return Promise.reject(new Error('password required'));
    }
    const data = {
      client_id: 'bYGKuGVw91e0NMfPGp44euvGt59s',
      client_secret: 'HP3RmkgAmEGro0gn1x9ioawQE8WMfvLXDz3ZqxpK',
      get_secure_url: 1,
      grant_type: 'password',
      username,
      password,
      device_token: 'pixiv',
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: serialize(data),
    };
    return axios('https://oauth.secure.pixiv.net/auth/token', options)
    .then(res => {
      this.auth = res.data.response;
      this.username = username;
      this.password = password;
      return res.data.response;
    }).catch(err => {
      if (err.response) {
        throw err.response.data;
      }
      else {
        throw err.message;
      }
    });
  }
  logout() {
    this.auth = null;
    this.username = null;
    this.password = null;
    return Promise.resolve();
  }

  authInfo() {
    return this.auth;
  }

  searchIllust(word, query) {
    if (!word) {
      return Promise.reject(new Error('word required'));
    }

    const queryString = qs.stringify(Object.assign({
      word,
      search_target: 'partial_match_for_tags',
      sort: 'date_desc',
      filter,
    }, query));
    return this.requestUrl(`/v1/search/illust?${queryString}`);
  }

  searchNovel(word, query) {
    if (!word) {
      return Promise.reject(new Error('word required'));
    }

    const queryString = qs.stringify(Object.assign({
      word,
      search_target: 'partial_match_for_tags',
      sort: 'date_desc',
      filter,
    }, query));
    return this.requestUrl(`/v1/search/novel?${queryString}`);
  }

  searchUser(word) {
    if (!word) {
      return Promise.reject('word required');
    }
    const queryString = qs.stringify(Object.assign({
      word,
      filter,
    }));
    return this.requestUrl(`/v1/search/user?${queryString}`);
  }

  searchAutoComplete(word) {
    if (!word) {
      return Promise.reject('word required');
    }
    const queryString = qs.stringify(Object.assign({
      word,
    }));
    return this.requestUrl(`/v1/search/autocomplete?${queryString}`);
  }

  userDetail(id, query) {
    if (!id) {
      return Promise.reject(new Error('user_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      user_id: id,
      filter,
    }, query));
    return this.requestUrl(`/v1/user/detail?${queryString}`);
  }

  userIllusts(id, query) {
    if (!id) {
      return Promise.reject(new Error('user_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      user_id: id,
      type: 'illust',
      filter,
    }, query));
    return this.requestUrl(`/v1/user/illusts?${queryString}`);
  }

  userBookmarksIllust(id, query) {
    if (!id) {
      return Promise.reject(new Error('user_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      user_id: id,
      restrict: 'public',
      filter,
    }, query));
    return this.requestUrl(`/v1/user/bookmarks/illust?${queryString}`);
  }

  // require auth
  illustBookmarkDetail(id, query) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      illust_id: id,
    }, query));
    return this.requestUrl(`/v2/illust/bookmark/detail?${queryString}`);
  }

  illustComments(id, query) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      illust_id: id,
      include_total_comments: true,
    }, query));
    return this.requestUrl(`/v1/illust/comments?${queryString}`);
  }

  illustRelated(id, query) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      illust_id: id,
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/related?${queryString}`);
  }

  illustDetail(id, query) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }

    const queryString = qs.stringify(Object.assign({
      illust_id: id,
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/detail?${queryString}`);
  }

  illustNew(query) {
    const queryString = qs.stringify(Object.assign({
      content_type: 'illust',
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/new?${queryString}`);
  }
  // require auth
  illustFollow(query) {
    const queryString = qs.stringify(Object.assign({
      restrict: 'public',
    }, query));
    return this.requestUrl(`/v2/illust/follow?${queryString}`);
  }

  // require auth
  illustRecommended(query) {
    const queryString = qs.stringify(Object.assign({
      include_ranking_illusts: true,
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/recommended?${queryString}`);
  }

  illustRecommendedPublic(query) {
    const queryString = qs.stringify(Object.assign({
      include_ranking_illusts: true,
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/recommended-nologin?${queryString}`);
  }

  illustRanking(query) {
    const queryString = qs.stringify(Object.assign({
      mode: 'day',
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/ranking?${queryString}`);
  }

  trendingTagsIllust(query) {
    const queryString = qs.stringify(Object.assign({
      filter,
    }, query));
    return this.requestUrl(`/v1/trending-tags/illust?${queryString}`);
  }

  // POST
  bookmarkIllust(id) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }
    const data = {
      illust_id: id,
      restrict: 'public',
    };
    //
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: serialize(data),
    };
    return this.requestUrl('/v1/illust/bookmark/add', options);
  }

  // POST
  unbookmarkIllust(id) {
    if (!id) {
      return Promise.reject(new Error('illust_id required'));
    }
    const data = {
      illust_id: id,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: serialize(data),
    };
    return this.requestUrl('/v1/illust/bookmark/delete', options);
  }

  // POST
  followUser(id) {
    if (!id) {
      return Promise.reject(new Error('user_id required'));
    }
    const data = {
      user_id: id,
      restrict: 'public',
    };
    //
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: serialize(data),
    };
    return this.requestUrl('/v1/user/follow/add', options);
  }

  // POST
  unfollowUser(id) {
    if (!id) {
      return Promise.reject(new Error('user_id required'));
    }
    const data = {
      user_id: id,
      restrict: 'public',
    };
    //
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: serialize(data),
    };
    return this.requestUrl('/v1/user/follow/delete', options);
  }

  mangaRecommended(query) {
    const queryString = qs.stringify(Object.assign({
      include_ranking_label: true,
      filter,
    }, query));
    return this.requestUrl(`/v1/manga/recommended?${queryString}`);
  }

  mangaNew(query) {
    const queryString = qs.stringify(Object.assign({
      content_type: 'manga',
      filter,
    }, query));
    return this.requestUrl(`/v1/illust/new?${queryString}`);
  }

  // require auth
  novelRecommended(query) {
    const queryString = qs.stringify(Object.assign({
      include_ranking_novels: true,
      filter,
    }, query));
    return this.requestUrl(`/v1/novel/recommended?${queryString}`);
  }

  novelRecommendedPublic(query) {
    const queryString = qs.stringify(Object.assign({
      include_ranking_novels: true,
      filter,
    }, query));
    return this.requestUrl(`/v1/novel/recommended-nologin?${queryString}`);
  }

  novelNew(query) {
    const queryString = qs.stringify(query);
    return this.requestUrl(`/v1/novel/new?${queryString}`);
  }

  userRecommended(query) {
    const queryString = qs.stringify(Object.assign({
      filter,
    }, query));
    return this.requestUrl(`/v1/user/recommended?${queryString}`);
  }

  userFollowing(id, query) {
    if (!id) {
      return Promise.reject('user_id required');
    }
    const queryString = qs.stringify(Object.assign({
      user_id: id,
      restrict: 'public',
    }, query));
    return this.requestUrl(`/v1/user/following?${queryString}`);
  }

  requestUrl(url, options) {
    if (!url) {
      return Promise.reject('Url cannot be empty');
    }
    options = options || {};
    options.headers = Object.assign({
      'App-OS': 'ios',
      // 'Accept-Language': 'en-us',
      'App-OS-Version': '9.3.3',
      'App-Version': '6.1.2',
      'User-Agent': 'PixivIOSApp/6.1.2 (iOS 9.0; iPhone8,2)',
    }, options.headers || {});
    if (this.auth && this.auth.access_token) {
      options.headers.Authorization = `Bearer ${this.auth.access_token}`;
    }
    return callApi(url, options).then(json => json).catch(err => {
      if (this.username && this.password) {
        return this.login(this.username, this.password).then(() => {
          options.headers.Authorization = `Bearer ${this.auth.access_token}`;
          return callApi(url, options);
        });
      }
      throw err;
    });
  }
}

module.exports = PixivApi;
