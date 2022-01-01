<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');

define('HOST', 'localhost');
define('USER', 'root');
define('PASS', '');
define('DB', 'essay');

function connect_db()
{
    $conn = new mysqli(HOST, USER, PASS, DB);
    if ($conn->connect_error) {
        return array('status' => 'false', 'data' => $conn->connect_error);
    }
    return $conn;
}

function check_user($user)
{
    $sql = 'SELECT * FROM users WHERE username=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $user);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    $result = $stm->get_result();
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        return array('code' => '0', 'data' => $data);
    }
    return array('code' => '1', 'message' => 'User not exists');
}

function sign_up($input)
{
    if (check_user($input->phone)['code'] == 0) {
        return array('code' => '1', 'message' => 'User đã tồn tại');
    }
    $sql = 'INSERT INTO users(name, username, password) VALUES(?,?,?)';
    $hash = password_hash($input->password, PASSWORD_DEFAULT);

    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param("sss", $input->name, $input->phone, $hash);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    return array('code' => 0, 'message' => 'Execute success');
}

function log_in($input)
{
    if (check_user($input->username)['code'] == 1) {
        return array('code' => '1', 'message' => 'Invalid username');
    }
    $data = check_user($input->username)['data'];
    $hash_pass = $data['password'];
    if (!password_verify($input->password, $hash_pass)) {
        return array('code' => '1', 'message' => "Invalid password");
    }
    return array('code' => '0', 'data' => $data);
}

function get_profile($user)
{
    $sql = 'SELECT * FROM users WHERE name=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $user);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    $result = $stm->get_result();
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        return array(
            'code' => '0', 'data' => array(
                'name' => $data['name'],
                'phone' => $data['username'],
                'email' => $data['email']
            )
        );
    }
    return array('code' => '1', 'message' => 'User not exists');
}

function update_profile($input, $username)
{
    if (check_user($username)['code'] != 0) {
        return array('code' => '1', 'message' => 'User không tồn tại');
    }
    $sql = 'UPDATE users SET name=?, email=? WHERE username=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('sss', $input->name, $input->email, $username);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    return array('code' => '0', 'data' => get_profile($input->name)['data']);
}

function change_password($input, $username)
{
    if (check_user($username)['code'] != 0) {
        return array('code' => '1', 'message' => 'User không tồn tại');
    }

    $password = check_user($username)['data']['password'];

    if (!password_verify($input->old, $password)) {
        return array('code' => '1', 'message' => "Invalid password");
    }

    $hash = password_hash($input->new, PASSWORD_DEFAULT);

    $sql = 'UPDATE users SET password=? WHERE username=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('ss', $hash, $username);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }

    return array('code' => '0');
}

function delete_profile($input)
{
    if (check_user($input->username)['code'] != 0) {
        return array('code' => '1', 'message' => 'User không tồn tại');
    }

    $password = check_user($input->username)['data']['password'];

    if (!password_verify($input->password, $password)) {
        return array('code' => '1', 'message' => "Invalid password");
    }

    $sql = 'DELETE FROM users where username=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $input->username);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }

    return array('code' => '0');
}

function create_order($input)
{
    $conn = connect_db();
    $query = $conn->query("SELECT * FROM orders WHERE id LIKE '$input->id%'");
    $count = $query->num_rows;
    if ($count < 10) {
        $count = '00' . $count;
    }
    if ($count < 100 && $count >= 10) {
        $count = '0' . $count;
    }
    $id = $input->id . $count;
    $sql = 'INSERT INTO orders(
        id,
        from_name, from_phone, from_address,
        to_name, to_phone, to_address,
        goods_name, weight, size, cod
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
    $stm = $conn->prepare($sql);
    $stm->bind_param(
        'sssssssssss',
        $id,
        $input->fromName,
        $input->fromPhone,
        $input->fromAddress,
        $input->toName,
        $input->toPhone,
        $input->toAddress,
        $input->goodsName,
        $input->weight,
        $input->size,
        $input->cod,
    );
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    return array('code' => '0', 'id' => $id);
}

function get_order($id)
{
    $sql = 'SELECT * FROM orders WHERE id=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $id);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    $result = $stm->get_result();
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        return array(
            'code' => '0', 'data' => array(
                'id' => $data['id'],
                'fromName' => $data['from_name'],
                'fromPhone' => $data['from_phone'],
                'fromAddress' => $data['from_address'],
                'toName' => $data['to_name'],
                'toPhone' => $data['to_phone'],
                'toAddress' => $data['to_address'],
                'goodsName' => $data['goods_name'],
                'weight' => $data['weight'],
                'size' => $data['size'],
                'cod' => $data['cod'],
            )
        );
    }
    return array('code' => '1', 'message' => 'Không tồn tại mã vận đơn');
}

function get_order_by_user($user)
{
    $sql = 'SELECT * FROM orders WHERE from_phone=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $user);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    $result = $stm->get_result();
    $list = array();
    if ($result->num_rows > 0) {
        while ($data = $result->fetch_assoc()) {
            $list[] = array(
                'id' => $data['id'],
                'fromName' => $data['from_name'],
                'fromPhone' => $data['from_phone'],
                'fromAddress' => $data['from_address'],
                'toName' => $data['to_name'],
                'toPhone' => $data['to_phone'],
                'toAddress' => $data['to_address'],
                'goodsName' => $data['goods_name'],
                'weight' => $data['weight'],
                'size' => $data['size'],
                'cod' => $data['cod'],
            );
        }
        return array('code' => '0', 'data' => $list);
    }
    return array('code' => '1', 'message' => 'Không tồn tại mã vận đơn');
}

function delete_order($id)
{
    if (get_order($id)['code'] != 0) {
        return array('code' => -1, 'message' => get_order($id)['message']);
    }
    $sql = 'DELETE FROM orders WHERE id=?';
    $conn = connect_db();
    $stm = $conn->prepare($sql);
    $stm->bind_param('s', $id);
    if (!$stm->execute()) {
        return array('code' => -1, 'message' => 'Execute failed');
    }
    return array('code' => '0');
}
