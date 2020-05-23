<?php
header('Content_type: application/json');
header("Access-Control-Allow-Origin: *");

include_once './Connect.php';


Class Products {

    private $connect;
    private $result = [];

    public function __construct() {
        $connect = new Connect();
        $this->connect = $connect->getConnect();
    }

    public function getProducts($filter) {
        $this->result = $this->executeSql('product', ['*'], $filter);
    }

    public function getResult() {
        return $this->result;
    }


    private function executeSql($table, $fields, $filter = '') {
        $fields = implode(',', $fields);
        $condition = $this->addCondition($filter);
        try {
            $sql = $this->connect->prepare("SELECT $fields FROM $table $condition");
            $sql->execute(['codigo' => $filter]);
            return $sql->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo $e->getMessage();
        }
        $this->connect->closeConnect();
        return [];
    }

    private function addCondition($filter) {
        $condition = '';
        if(!empty($filter)) {
            $condition .= 'WHERE codigo = :codigo';
        }

        return $condition;
    }

}
$params = explode('/', $_GET['peticion']);
if (strtolower($params[0]) == 'products') {
    $filter = isset($params[1]) ? $params[1] : '';
    $product = new Products();
    $product->getProducts($filter);
    $result = $product->getResult();
    echo json_encode($result);
} 
else {
    header("HTTP/1.1 400 Bad Request");
    exit();
}