/*
 Navicat Premium Data Transfer

 Source Server         : restaurant
 Source Server Type    : MySQL
 Source Server Version : 80022
 Source Host           : localhost:3306
 Source Schema         : restaurant

 Target Server Type    : MySQL
 Target Server Version : 80022
 File Encoding         : 65001

 Date: 10/11/2020 16:03:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL COMMENT '分类id',
  `name` int DEFAULT NULL COMMENT '分类名称',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `operator` int DEFAULT NULL COMMENT '操作者',
  `sort` int DEFAULT NULL COMMENT '排序',
  `status` int DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品分类';

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int NOT NULL COMMENT '订单id',
  `total_price` double DEFAULT NULL COMMENT '订单总额',
  `real_price` double DEFAULT NULL COMMENT '实付金额',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  `status` int DEFAULT NULL COMMENT '订单状态',
  `user_id` int DEFAULT NULL COMMENT '用户id',
  `remark` varchar(0) DEFAULT NULL COMMENT '备注',
  `table_number` int DEFAULT NULL COMMENT '座位号',
  `people_num` int DEFAULT NULL COMMENT '客户人数',
  `pay_time` timestamp NULL DEFAULT NULL COMMENT '支付时间',
  `pay_status` int DEFAULT NULL COMMENT '支付状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单表';

-- ----------------------------
-- Table structure for order_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `order_snapshot`;
CREATE TABLE `order_snapshot` (
  `id` int NOT NULL COMMENT '订单商品快照id',
  `order_id` int DEFAULT NULL COMMENT '订单id',
  `product_id` int DEFAULT NULL COMMENT '商品id',
  `num` int DEFAULT NULL COMMENT '商品数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单商品快照';

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int NOT NULL COMMENT '菜肴id',
  `title` varchar(0) DEFAULT NULL COMMENT '菜品标题',
  `banner` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '轮播图',
  `tag` varchar(0) DEFAULT NULL COMMENT '菜品标签',
  `price` double DEFAULT NULL COMMENT '菜品价格',
  `desc` text COMMENT '详情',
  `sub_title` varchar(0) DEFAULT NULL COMMENT '副标题',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `operator` int DEFAULT NULL COMMENT '操作者',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜肴商品表';

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `open_id` int NOT NULL COMMENT '微信id',
  `avatar` varchar(0) DEFAULT NULL COMMENT '用户头像',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`,`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';

SET FOREIGN_KEY_CHECKS = 1;
