# Pixiv API Client
[![Build Status](https://travis-ci.org/alphasp/pixiv-api-client.svg?branch=master)](https://travis-ci.org/alphasp/pixiv-api-client)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Promise based Pixiv API client for node.js and react native 


## Install

```
$ npm install pixiv-api-client --save 
```

## Usage

```js
const PixivApi = require('pixiv-api-client');
const pixiv = new PixivApi();

const word = 'ラブライブ';
pixiv.login('username', 'password').then(() => {
  return pixiv.searchIllust(word).then(json => {
	console.log(json);
	return pixiv.requestUrl(json.next_url);
  }).then(json => {
	console.log(json); //next results
  });
});
```

## API

### PixivApi()
<hr>

#### pixiv.login(username, password, rememberPassword)
Api client will try once to relogin again on error if rememberPassword is set to `true`

- `username` - Pixiv username
- `password` - Pixiv password
- `rememberPassword` - Boolean (default: `true`)

#### pixiv.logout()

#### pixiv.refreshAccessToken(refreshToken)
Refresh access token with refreshToken

- `refreshToken` - string (if not provided, will use refresh token that stored with api client after login)

#### pixiv.createProvisionalAccount(nickName)

- `nickName` - string

#### pixiv.userState()
require auth

#### pixiv.editUserAccount(fields)
require auth

- `fields` - object
  - pixivId
  - email
  - currentPassword
  - newPassword

#### pixiv.sendAccountVerificationEmail()  
require auth

#### pixiv.searchIllust(word, options)
require auth

- `word` - word to search (required)
- `options` - object (optional)
  - `search_target`: `partial_match_for_tags` | `exact_match_for_tags` | `title_and_caption` (default: `partial_match_for_tags`)
  - `sort`: `date_desc` | `date_asc` (default: `date_desc`)
  - `duration`: `within_last_day` | `within_last_week` | `within_last_month`

#### pixiv.searchUser(word)
require auth

- `word` - word to search (required)

#### pixiv.searchAutoComplete(word)
require auth

- `word` - word to search (required)

#### pixiv.userDetail(userId, options)
- `userId` - Pixiv user id
- `options` - object (optional)

#### pixiv.userIllusts(id, options) 
require auth

- `id` - Pixiv illust id
- `options` - object (optional)
  - `type` - one of `illust` | `manga`

#### pixiv.userBookmarksIllust(id, options)
require auth

- `id` - Pixiv illust id
- `options` - object (optional)
  - `restrict` - one of `public` | `private` (default: `public`)

#### pixiv.userBookmarkIllustTags(options)
require auth

- `options` - object (optional)
  - `restrict` - one of `public` | `private` (default: `public`)

#### pixiv.illustBookmarkDetail(id, options)
require auth

- `id` - Pixiv illust id
- `options` - object (optional)

#### pixiv.illustComments(id, options)
require auth

- `id` - Pixiv illust id
- `options` - object (optional)

#### pixiv.illustRelated(id, options)
require auth

- `id` - Pixiv illust id
- `options` - object (optional)

#### pixiv.illustDetail(id, options)
require auth

- `id` - Pixiv illust id
- `options` - object (optional)

#### pixiv.illustNew(options)
require auth

- `options` - object (optional)
 
#### pixiv.illustFollow(options)
require auth

- `options` - object (optional)
  - `restrict` - one of `all` | `public` | `private`  (default: `all`)

#### pixiv.illustRecommended(options)
require auth

- `options` - object (optional)

#### pixiv.illustRecommendedPublic(options)
- `options` - object (optional)

#### pixiv.illustRanking(options)
require auth

- `options` - object
  - `date`: Date
  - `mode`: `day` | `week` | `month` | `day_male` | `day_female` | `week_original` | `week_rookie` | `day_r18` | `day_male_r18` | `day_female_r18` | `week_r18` | `week_r18g`| `day_manga` | `week_manga` | `month_manga` | `week_rookie_manga` | `day_r18_manga` | `week_r18_manga` | `week_r18g_manga` (default: `day`)

#### pixiv.illustMyPixiv()
require auth

#### pixiv.illustAddComment(id, comment)
require auth

- `id` - Pixiv illust id
- `comment` - string

#### pixiv.ugoiraMetaData(id)
require auth

- `id` - Pixiv illust(ugoira) id

#### pixiv.trendingTagsIllust(options)
require auth

- `options` - object (optional)

#### pixiv.bookmarkIllust(id, restrict, tags)
require auth

- `id` - Pixiv illust id
- `restrict` - one of `public` | `private` (default: `public`)
- `tags` - array of string (optional)

#### pixiv.unbookmarkIllust(id)
require auth

- `id` - Pixiv illust id

#### pixiv.mangaRecommended(options)
require auth

- `options` - object (optional)

#### pixiv.mangaNew(options)
require auth

- `options` - object (optional)

#### pixiv.searchNovel(word, options)
require auth

- `word` - word to search (required)
- `options` - object (optional)
  - `search_target`: `partial_match_for_tags` | `exact_match_for_tags` | `title_and_caption` (default: `partial_match_for_tags`)
  - `sort`: `date_desc` | `date_asc` (default: `date_desc`)
  - `duration`: `within_last_day` | `within_last_week` | `within_last_month`
 
#### pixiv.novelRecommended(options)
require auth

- `options` - object (optional)

#### pixiv.novelRecommendedPublic(options)
- `options` - object (optional)

#### pixiv.novelNew(options)
require auth

- `options` - object (optional)

#### pixiv.userRecommended(options)
require auth

- `options` - object (optional)

#### pixiv.userFollowing(id, options)
require auth

- `id` - Pixiv user id
- `options` - object (optional)
  - `restrict`: `public` | `private` (default: `public`)

#### pixiv.userFollower(id, options)
require auth

- `id` - Pixiv user id
- `options` - object (optional)

#### pixiv.userMyPixiv(id)
require auth

- `id` - Pixiv user id

#### pixiv.followUser(id, restrict)
require auth

- `id` - Pixiv user id
- `restrict` - one of `public` | `private` (default: `public`)

#### pixiv.unfollowUser(id)
require auth

- `id` - Pixiv user id

#### pixiv.setLanguage(lang)
set HTTP header Accept-Language for pixiv api request
 
- `lang` - HTTP header Accept-Language

#### pixiv.requestUrl(url, options)
can be use to request pixiv endpoint or use for traversing results by passing next_url from result of other api such as `pixiv.searchIllust`

- `options` - object (optional)


## Tests

Export pixiv username and password before running Tests.

```
$ export USER_NAME=Pixiv username
$ export PASSWORD=Pixiv password
$ npm test
```

## Related projects
[PxView](https://github.com/alphasp/pxview) - Android/iOS client for Pixiv built in react-native

## License

MIT