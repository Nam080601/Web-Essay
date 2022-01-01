<?php
require_once('database.php');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    http_response_code(405);
    die(json_encode(array('code' => '405', 'message' => 'API này chỉ hỗ trợ GET')));
}

if (!isset($_GET['id'])) {
    die(json_encode(array('code' => 1, 'message' => 'Mã vận đơn không hợp lệ')));
}

$id = $_GET['id'];

if (get_order($id)['code'] != 0) {
    die(json_encode(array('code' => 1, 'message' => get_order($id)['message'])));
}

die(json_encode(array(
    'code' => 0,
    'message' => 'Get order thành công',
    'data' => get_order($id)['data']
)));
