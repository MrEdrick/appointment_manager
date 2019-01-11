--remove toggle questions because they are irrelevants
update anamneses_questions set ID_QUESTION_TOGGLE = Null
where ID_QUESTION_DESCRIPT in (2, 3, 4, 5, 6, 7, 8, 9, 10)

update answers_anamneses_questions set ANSWER_TOGGLE = Null
where ID_ANAMNESE_QUESTION in (2, 3, 4, 5, 6, 7, 8, 9, 10)
