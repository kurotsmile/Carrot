# Carrot
Carrot Store ứng dụng web giới thiệu các trò chơi,ứng dụng và dịch vụ tích hợp nền tảng Firebase, bao gồm các tài nguyên sử dụng trong các trò chơi. 

[![Build Status](https://github.com/ajaxorg/ace/workflows/CI/badge.svg)](https://github.com/kurotsmile/Carrot/actions) 
[![Build Status](https://img.shields.io/badge/Facebook-%231877F2.svg)](https://www.facebook.com/kurotsmile) 
[![Build Status](https://img.shields.io/badge/Twitter-%231DA1F2.svg)](https://twitter.com/carrotstore1) 
[![Build Status](https://img.shields.io/badge/linkedin-%230077B5.svg)](https://www.linkedin.com/in/tranthienthanh/) 

`URL:`https://carrotstore.web.app
`URL:`https://kurotsmile.github.io/Carrot

## Các tính năng nỗi bậc
- Các ứng dụng và trò chơi
- Danh sách liên hệ
- Danh sách ảnh nền
- Danh sách biểu tượng
- Danh sách âm nhạc
- Kinh Thánh online
- Danh sách Radio
- Danh sách Nhạc không lời
- Mã nguồn lập trình

## Dịch vụ Api
- Api Chat
- Api Music

## Hướng dẫn API

#### Get all items chat

```http
  GET /ai/chat?=key
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `key` | `string` | **Required**. Your API key |

#### Get item song

```http
  GET /song/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of song to fetch |