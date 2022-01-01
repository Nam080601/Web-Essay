<?php
require_once('database.php');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    die(json_encode(array('code' => '405', 'message' => 'API này chỉ hỗ trợ POST')));
}

$input = json_decode(file_get_contents('php://input'));

if (is_null($input)) {
    die(json_encode(array('code' => 2, 'message' => 'Chỉ hỗ trợ JSON')));
}

if (!property_exists($input, 'username') || !property_exists($input, 'password')) {
    http_response_code(400);
    die(json_encode(array('code' => 1, 'message' => 'Thiếu thông tin đầu vào')));
}

if (empty($input->username) || empty($input->password)) {
    die(json_encode(array('code' => 1, 'message' => 'Thông tin không hợp lệ')));
}

if (delete_profile($input)['code'] != 0) {
    die(json_encode(array('code' => 1, 'message' => delete_profile($input)['message'])));
}

die(json_encode(array(
    'code' => 0,
    'message' => 'Xoá profile thành công',
)));
