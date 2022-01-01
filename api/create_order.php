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

if (
    !property_exists($input, 'id') ||
    !property_exists($input, 'fromName') ||
    !property_exists($input, 'fromPhone') ||
    !property_exists($input, 'fromAddress') ||
    !property_exists($input, 'toName') ||
    !property_exists($input, 'toPhone') ||
    !property_exists($input, 'toAddress') ||
    !property_exists($input, 'goodsName') ||
    !property_exists($input, 'weight') ||
    !property_exists($input, 'size') ||
    !property_exists($input, 'cod')
) {
    http_response_code(400);
    die(json_encode(array('code' => 1, 'message' => 'Thiếu thông tin đầu vào')));
}

if (
    !isset($input->id) ||
    !isset($input->fromName) ||
    !isset($input->fromPhone) ||
    !isset($input->fromAddress) ||
    !isset($input->toName) ||
    !isset($input->toPhone) ||
    !isset($input->toAddress) ||
    !isset($input->goodsName) ||
    !isset($input->weight) ||
    !isset($input->size) ||
    !isset($input->cod)
) {
    die(json_encode(array('code' => 1, 'message' => 'Thông tin không hợp lệ')));
}

$result = create_order($input);

if ($result['code'] != 0) {
    die(json_encode(array('code' => 1, 'message' => $result['message'])));
}

die(json_encode(array(
    'code' => 0,
    'message' => 'Tạo đơn thành công',
    'id' => $result['id']
)));
