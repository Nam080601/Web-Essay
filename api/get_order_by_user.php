<?php
require_once('database.php');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    http_response_code(405);
    die(json_encode(array('code' => '405', 'message' => 'API này chỉ hỗ trợ GET')));
}

if (!isset($_GET['user'])) {
    die(json_encode(array('code' => 1, 'message' => 'User không hợp lệ')));
}

$user = $_GET['user'];

if (get_order_by_user($user)['code'] != 0) {
    die(json_encode(array('code' => 1, 'message' => get_order_by_user($user)['message'])));
}

die(json_encode(array(
    'code' => 0,
    'message' => 'Get order thành công',
    'data' => get_order_by_user($user)['data']
)));
