<?php
require_once('database.php');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] != 'PUT') {
    die(json_encode(array('code' => '405', 'message' => 'API này chỉ hỗ trợ PUT')));
}

$input = json_decode(file_get_contents('php://input'));

if (!isset($_GET['username'])) {
    die(json_encode(array('code' => 1, 'message' => 'ID không hợp lệ')));
}

$username = $_GET['username'];

if (is_null($input)) {
    die(json_encode(array('code' => 2, 'message' => 'Chỉ hỗ trợ JSON')));
}

if (!property_exists($input, 'name') || !property_exists($input, 'email')) {
    http_response_code(400);
    die(json_encode(array('code' => 1, 'message' => 'Thiếu thông tin đầu vào')));
}

if (empty($input->name) || empty($input->email)) {
    die(json_encode(array('code' => 1, 'message' => 'Thông tin không hợp lệ')));
}

if (update_profile($input, $username)['code'] != 0) {
    die(json_encode(array('code' => 1, 'message' => update_profile($input, $username)['message'])));
}

die(json_encode(array(
    'code' => 0,
    'message' => 'Update profile thành công',
    'profile' => update_profile($input, $username)['data']
)));
