---
title: mysql练习题
date: 2021-08-12
tags:
  - MySQL
  - 数据库
  - SQL练习
  - 数据操作
  - 查询优化
---

# mysql练习题

<!-- DESC SEP -->

本文整理了50道MySQL经典练习题，涵盖数据库表结构设计、多表关联查询及复杂业务场景的SQL实现。内容包含完整的建表语句、示例数据，以及针对不同难度级别的查询解决方案，涉及成绩分析、教师课程关联、学生选课统计等实际案例。通过窗口函数、子查询、连接查询等多种技术手段，帮助开发者系统掌握SQL语句优化和复杂数据处理技巧。

<!-- DESC SEP -->

## 数据

```mysql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `c_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `c_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `t_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`c_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('01', '语文', '02');
INSERT INTO `course` VALUES ('02', '数学', '01');
INSERT INTO `course` VALUES ('03', '英语', '03');

-- ----------------------------
-- Table structure for score
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score`  (
  `s_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `c_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `s_score` int(3) NULL DEFAULT NULL,
  PRIMARY KEY (`s_id`, `c_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of score
-- ----------------------------
INSERT INTO `score` VALUES ('01', '01', 80);
INSERT INTO `score` VALUES ('01', '02', 90);
INSERT INTO `score` VALUES ('01', '03', 99);
INSERT INTO `score` VALUES ('02', '01', 70);
INSERT INTO `score` VALUES ('02', '02', 60);
INSERT INTO `score` VALUES ('02', '03', 80);
INSERT INTO `score` VALUES ('03', '01', 80);
INSERT INTO `score` VALUES ('03', '02', 80);
INSERT INTO `score` VALUES ('03', '03', 80);
INSERT INTO `score` VALUES ('04', '01', 50);
INSERT INTO `score` VALUES ('04', '02', 30);
INSERT INTO `score` VALUES ('04', '03', 20);
INSERT INTO `score` VALUES ('05', '01', 76);
INSERT INTO `score` VALUES ('05', '02', 87);
INSERT INTO `score` VALUES ('06', '01', 31);
INSERT INTO `score` VALUES ('06', '03', 34);
INSERT INTO `score` VALUES ('07', '02', 89);
INSERT INTO `score` VALUES ('07', '03', 98);

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `s_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `s_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `s_birth` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `s_sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`s_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('01', '赵雷', '1990-01-01', '男');
INSERT INTO `student` VALUES ('02', '钱电', '1990-12-21', '男');
INSERT INTO `student` VALUES ('03', '孙风', '1990-05-20', '男');
INSERT INTO `student` VALUES ('04', '李云', '1990-08-06', '男');
INSERT INTO `student` VALUES ('05', '周梅', '1991-12-01', '女');
INSERT INTO `student` VALUES ('06', '吴兰', '1992-03-01', '女');
INSERT INTO `student` VALUES ('07', '郑竹', '1989-07-01', '女');
INSERT INTO `student` VALUES ('08', '王菊', '1990-01-20', '女');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`  (
  `t_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `t_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`t_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('01', '张三');
INSERT INTO `teacher` VALUES ('02', '李四');
INSERT INTO `teacher` VALUES ('03', '王五');

SET FOREIGN_KEY_CHECKS = 1;
```

## 题目

![	](https://blog.yxlyz.net/usr/uploads/2021/05/3853383116.jpg)

## 答案

```mysql
1.
SELECT student.*,b.s_score as '课程1',c.s_score as '课程2' FROM student
INNER JOIN score b ON student.s_id=b.s_id AND b.c_id='01'
INNER JOIN score c ON student.s_id=c.s_id AND c.c_id='02'
WHERE b.s_score>c.s_score

2.
SELECT student.*,b.s_score as '课程1',c.s_score as '课程2' FROM student
INNER JOIN score b ON b.s_id=student.s_id AND b.c_id='01'
INNER JOIN score c ON c.s_id=student.s_id AND c.c_id='02'
WHERE b.s_score<c.s_score

3.
SELECT student.s_id,student.s_name,ROUND(AVG(score.s_score),2) AS avg_score
FROM student
INNER JOIN score ON score.s_id=student.s_id
GROUP BY student.s_id
HAVING avg_score >= 60

4.
SELECT student.s_id,student.s_name,ROUND(AVG(IFNULL(score.s_score,0)),2) AS avg_score
FROM student
LEFT JOIN score ON score.s_id=student.s_id
GROUP BY student.s_id
HAVING avg_score < 60
-----或者-----
SELECT student.s_id,student.s_name,ROUND(AVG(score.s_score),2) AS avg_score
FROM student
LEFT JOIN score ON score.s_id=student.s_id
GROUP BY student.s_id
HAVING avg_score < 60 OR avg_score IS NULL

5.
SELECT student.s_id,student.s_name,COUNT(score.c_id) as '选课总数',SUM(score.s_score) as '总成绩'
from student
LEFT JOIN score ON student.s_id=score.s_id
GROUP BY student.s_id,student.s_name

6.
SELECT COUNT(teacher.t_name) FROM teacher WHERE teacher.t_name LIKE '李%'

7.	
SELECT student.*,teacher.t_name,course.c_name FROM student
LEFT JOIN score on score.s_id = student.s_id
LEFT JOIN course on course.c_id = score.c_id
LEFT JOIN teacher ON  teacher.t_id = course.t_id
WHERE teacher.t_name = '张三'

8.
SELECT * FROM student
WHERE student.s_id not in(
	# 学生学过张三的课（上题得出）
	SELECT student.s_id FROM student
		LEFT JOIN score on score.s_id = student.s_id
		LEFT JOIN course on course.c_id = score.c_id
		LEFT JOIN teacher ON  teacher.t_id = course.t_id
		WHERE teacher.t_name = '张三'
)

9.
SELECT student.*,s1.s_score AS '01分数',s2.s_score AS '02分数'
FROM student
LEFT JOIN score s1 ON s1.s_id = student.s_id
LEFT JOIN score s2 ON s2.s_id = student.s_id 
WHERE s1.c_id = '01' AND s2.c_id = '02'

10.
SELECT student.*,s1.s_score AS '01分数',s2.s_score AS '02分数'
FROM student
INNER JOIN score s1 ON s1.s_id = student.s_id AND s1.c_id = '01'
LEFT JOIN score s2 ON s2.s_id = student.s_id AND s2.c_id = '02'
WHERE s2.s_score IS NULL

11.
SELECT * FROM student
WHERE student.s_id IN (
	SELECT score.s_id FROM score GROUP BY score.s_id HAVING COUNT(score.s_score)<3
)

12.
SELECT * FROM student WHERE student.s_id IN (
	SELECT DISTINCT score.s_id FROM score WHERE score.c_id IN(
		SELECT score.c_id FROM score WHERE score.s_id='01'
	)
)

13.
SELECT * FROM student WHERE student.s_id IN (
	SELECT score.s_id FROM score WHERE score.c_id IN(
		SELECT score.c_id FROM score WHERE score.s_id='01'
	)AND score.s_id != '01' GROUP BY score.s_id HAVING COUNT(score.c_id)>=3
)

14.
SELECT * FROM student 
WHERE student.s_id NOT IN(
	SELECT score.s_id FROM score
	INNER JOIN course ON course.c_id = score.c_id
	INNER JOIN teacher ON teacher.t_id = course.t_id
	WHERE teacher.t_name = '张三'
)

15.
SELECT student.s_id,student.s_name,AVG(score.s_score) AS AVG_SCORE FROM student
INNER JOIN score on student.s_id = score.s_id
WHERE student.s_id in (
	SELECT score.s_id FROM score WHERE score.s_score<60
)
GROUP BY student.s_id

16.
SELECT student.*,score.s_score AS 01_score FROM student
INNER JOIN score ON student.s_id = score.s_id AND score.s_score<60
WHERE score.c_id = '01'
ORDER BY 01_score DESC

17.
SELECT
	student.*,
	01_score.s_score AS 01_score,
	02_score.s_score AS 02_score,
	03_score.s_score AS 03_score,
	AVG( sc.s_score ) AS AVG_score 
FROM
	student
	LEFT JOIN score 01_score ON student.s_id = 01_score.s_id 
	AND 01_score.c_id = '01'
	LEFT JOIN score 02_score ON student.s_id = 02_score.s_id 
	AND 02_score.c_id = '02'
	LEFT JOIN score 03_score ON student.s_id = 03_score.s_id 
	AND 03_score.c_id = '03'
	LEFT JOIN score sc ON student.s_id = sc.s_id 
GROUP BY
	student.s_id 
ORDER BY
	AVG_score DESC
	
18.
SELECT
	score.c_id,
	course.c_name,
	MAX( score.s_score ) AS max_sc,
	MIN( score.s_score ) AS min_sc,
	AVG( score.s_score ) AS avg_sc 
FROM
	score
	INNER JOIN course ON course.c_id = score.c_id 
GROUP BY
	score.c_id

19.
SET @scrank = 0;
SELECT
	student.*,
	score.c_id,
	score.s_score,
	@scrank := @scrank + 1 AS sc_rank 
FROM
	student
	INNER JOIN score ON score.s_id = student.s_id 
ORDER BY
	score.c_id,
	score.s_score DESC

20.
SET @scrank = 0;
SELECT
	student.*,
	SUM( score.s_score ) AS sum_sc,
	@scrank := @scrank + 1 AS sc_rank 
FROM
	student
	INNER JOIN score ON score.s_id = student.s_id 
GROUP BY
	student.s_id 
ORDER BY
	sum_sc DESC
	
21.
SELECT
	teacher.*,
	course.c_name,
	AVG( score.s_score ) AS avg_sc 
FROM
	teacher
	LEFT JOIN course ON course.t_id = teacher.t_id
	LEFT JOIN score ON score.c_id = course.c_id 
GROUP BY
	teacher.t_id,
	course.c_name 
ORDER BY
	avg_sc DESC
	
22.
(SELECT st.*,sc.c_id,sc.s_score FROM score sc,student st WHERE sc.s_id = st.s_id AND sc.c_id = '01' ORDER BY sc.s_score DESC LIMIT 1,2)
UNION ALL
(SELECT st.*,sc.c_id,sc.s_score FROM score sc,student st WHERE sc.s_id = st.s_id AND sc.c_id = '02' ORDER BY sc.s_score DESC LIMIT 1,2)
UNION ALL
(SELECT st.*,sc.c_id,sc.s_score FROM score sc,student st WHERE sc.s_id = st.s_id AND sc.c_id = '03' ORDER BY sc.s_score DESC LIMIT 1,2)

23.
SELECT c.c_id,c.c_name 
,((SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id AND sc.s_score<=100 AND sc.s_score>80)/(SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id )) "100-85"
,((SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id AND sc.s_score<=85 AND sc.s_score>70)/(SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id )) "85-70"
,((SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id AND sc.s_score<=70 AND sc.s_score>60)/(SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id )) "70-60"
,((SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id AND sc.s_score<=60 AND sc.s_score>=0)/(SELECT COUNT(*) FROM score sc WHERE sc.c_id=c.c_id )) "60-0"
FROM course c ORDER BY c.c_id

24.
SELECT
	student.s_id,
	student.s_name,
	ROUND(( CASE WHEN AVG( score.s_score ) IS NULL THEN 0 ELSE AVG( score.s_score ) END ), 2 ) AS avg_sc 
FROM
	student
	INNER JOIN score ON score.s_id = student.s_id 
GROUP BY
	score.s_id 
ORDER BY
	avg_sc DESC
	
25.
SELECT
	sc1.* 
FROM
	score sc1 
WHERE
	( SELECT COUNT(*) FROM score sc2 WHERE sc1.c_id = sc2.c_id AND sc1.s_score < sc2.s_score )< 3 
ORDER BY
	sc1.c_id,
	sc1.s_score DESC
	
26.
SELECT score.c_id,course.c_name,COUNT(score.s_id) AS stu_num FROM score,course
WHERE course.c_id = score.c_id
GROUP BY score.c_id

27.
SELECT student.s_id,student.s_name 
FROM student
WHERE student.s_id IN (
	SELECT score.s_id FROM score 
	GROUP BY score.s_id 
	HAVING COUNT(score.s_id) =2 
)

28.
SELECT student.s_sex,COUNT(student.s_sex) FROM student GROUP BY student.s_sex

29.
SELECT student.* FROM student WHERE student.s_name LIKE '%风%'

30.
# 为了重名，加一条学生信息
# INSERT INTO `practice_test`.`student`(`s_id`, `s_name`, `s_birth`, `s_sex`) VALUES ('09', '李云', '1992-01-02', '女')
# sql语句如下
SELECT student.s_name,COUNT(*) FROM student GROUP BY student.s_name HAVING COUNT(*)>1

31.
SELECT student.* FROM student WHERE student.s_birth LIKE '1990%'

32.
# 为了有平均分相同的情况，在分数表（score）中插入两条数据，
# s_id  c_id  s_score
# 08	04	  69
# 09	04	  68
SELECT score.c_id,AVG(score.s_score) AS avg_sc FROM score GROUP BY score.c_id ORDER BY avg_sc DESC,c_id

33.
SELECT student.s_id,student.s_name,AVG(score.s_score) AS avg_sc FROM student
INNER JOIN score ON score.s_id=student.s_id
GROUP BY student.s_id
HAVING avg_sc >=85

34.
SELECT student.s_name,score.s_score FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id
WHERE score.s_score<60 and course.c_name='数学'

35.
SELECT student.s_name,course.c_name,score.s_score FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id

36.
SELECT student.s_name,course.c_name,score.s_score FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id
WHERE score.s_score>70

37.
SELECT student.s_name,course.c_name,score.s_score FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id
WHERE score.s_score<60

38.
SELECT student.s_id,student.s_name,course.c_name,score.s_score FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id
WHERE score.s_score>=80 AND score.c_id = '01'

39.
SELECT course.c_name,COUNT(score.s_score) AS st_num FROM course
LEFT JOIN score ON score.c_id=course.c_id
GROUP BY course.c_id

40.
SELECT student.*,score.s_score,teacher.t_name FROM student
INNER JOIN score ON score.s_id=student.s_id
INNER JOIN course ON course.c_id = score.c_id
INNER JOIN teacher ON teacher.t_id = course.t_id
WHERE teacher.t_name = '张三'
ORDER BY score.s_score DESC
LIMIT 0,1

41.
SELECT st.s_id,st.s_name,sc.c_id,sc.s_score 
FROM student st
LEFT JOIN score sc ON sc.s_id = st.s_id
LEFT JOIN course c ON c.c_id = sc.c_id 
WHERE(
	SELECT COUNT( * ) 
    FROM student st2
	LEFT JOIN score sc2 ON sc2.s_id = st2.s_id
	LEFT JOIN course c2 ON c2.c_id = sc2.c_id 
	WHERE sc.s_score = sc2.s_score 
	AND c.c_id <> c2.c_id 
	)>1
	
42.
SELECT a.* FROM score AS a
LEFT JOIN score as b
ON a.c_id = b.c_id AND a.s_score < b.s_score # 列出同一门课内所有分数比较的情况
GROUP BY a.c_id, a.s_id
HAVING COUNT(b.c_id)<=1 #他只比1个低，或者比0个低（即他就是第一）
ORDER BY a.c_id;

43.
SELECT score.c_id,COUNT(score.s_id) AS st_num FROM score
GROUP BY score.c_id
HAVING st_num>5

44.
SELECT sc.s_id,COUNT(sc.s_score) count_sc FROM score sc
GROUP BY sc.s_id
HAVING count_sc>=2

45.
SELECT student.* FROM student
WHERE student.s_id IN(
	SELECT sc.s_id FROM score sc
	GROUP BY sc.s_id
	HAVING COUNT(sc.s_score)>2
)

46.
select *, TIMESTAMPDIFF(YEAR,student.s_birth,NOW()) as 年龄 from Student

47.
SELECT student.*,WEEK(student.s_birth),WEEK(NOW()) FROM student
WHERE WEEK(student.s_birth)=WEEK(NOW())

48.
SELECT student.*,WEEK(student.s_birth),WEEK(NOW()) FROM student
WHERE WEEK(student.s_birth)=WEEK(NOW())+1

49.
SELECT student.*,MONTH(student.s_birth),MONTH(NOW()) FROM student
WHERE MONTH(student.s_birth)=MONTH(NOW())

50.
SELECT student.*,MONTH(student.s_birth),MONTH(NOW()) FROM student
WHERE MONTH(student.s_birth)=MONTH(NOW())+1
```

