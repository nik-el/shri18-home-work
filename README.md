# Репозитория для домашних заданий в ШРИ
# shri18-home-work

## ШРИ2018/2 - ДЗ «Адаптивная вёрстка»
### Автоматизация проекта

Атоматизация происходит с использование `gulp`.
+ `gulp-sass` компилирует `.scss` файлы в единый `style.css`
+ `autoprefixer` и `gulp-postcss` добавляют префиксы для браузеров
+ `browser-sync` позволяет следить за изменениями
 `.html` и `.scss` файлов, `gulp-babel-minify` сжимает `.js`, a `imagemin` картинки.
 Потом все отправляется в папку `build`. 
 
### Верстка
- В проекте используется grid layout. В зависимости от размера экрана, кол-во колонок изменяется. Большие карточки занимают 4, средние 3, малые 2. 
Высота большой карточки - 3 строки. Карточки строются так, как пришли «с сервера». Для изменения входных данных достаточно изменить нутро файлы `data/events.json`. 
- Иногда карточки выстраиваются не очень аккуратно. Для улучшения UX предусмотрел параметр «плотной сортировки». (карточки выстраиваются в начале по времени, а потом пустоты заполняются другими)
- В некоторых местах макета были разрозненные отступы и/или параметры. В этих случаях позволил сеье их несильно «унифицировать»
- Размер шрифта задается через `rem`
- Слайдеры делал через `input range`, но оживить пока не успел (видимо, будем это делать в других ДЗ)
- Обрезает заголовок карточки и добавляет `...`. Действие основано на высоте строки.
- Адаптивные изображения (на примере пылесоса). Тк имя файлы и тип изображения мы получаем в JSONе, поэтому скрипт разбивает имя, указывает нужное изображение и записывает в `srcset`.

### Шаблонизатор
- Используется стандартный тег `template`. Использовал так: создавал «рыбу» и потом, бегая по `json` заполнял данные, а узлы данных, что не находил, удалял из template.
- Код шаблонизатора пока очень сырой, отрефакторить я его не успеваю, но он вроде работает :) Исходил из того, что важен сам факт рабочей шаблонизации.

## ШРИ2018/2 - ДЗ «Работа с сенсорным пользовательским вводом»
### Контейнер + бэкграунд имедж 
Что умеет:
- Изображение можно двигать мышкой/пальцем
- Зум/Пинч позволяет зумить или отодвигать изображение. Основано на высчитывания расстояний между двумя точками на плоскости
- Ротейт менят яркость. Более плавное рбаотает, если один палец скорее неподвижный. Но и одновременно тоже должно менять. Из приятного - высчитывает углы. Из неприятного - прямо сейчас я не могу придумать, как мне определять направление (5:00 утра). Завтра еще днем обдумаю и ,если будет актуально, поправлю. Из-за этого яркость отталкивается от захардкоженной константы, что позволяет в обе сторны менять яркость.
- Показывает текущее значение ниже контейнера
- Использован полифил от джиквери  </3  для айфона (на нем и тестил)


## ШРИ2018/2 - ДЗ «Мультимедия»
### Запуск
- Зайти в [репозиторий с тестовыми видео потоками](https://github.com/mad-gooze/shri-2018-2-multimedia-homework/blob/master/streams/README.md), скачать и запустить по инструкции

- Скачать данные из ветки домашнего задания, запустить и перейти на страницу [Видеонаблюдение](http://localhost:3000/camera.html)
```
npm i
npm start
```

### Описание проекта
- Раздел представляет собой сетку из 4х превью видео. По клику на каждый открывается полная версия с возможностью настройки контраста, яркости и определения текущей громкости через визульную диаграмму. 
- Настройки изображения для видео сохраняются, что позволяет гибко настроить каждое изображение отдельно.
- Выход к превью предусмотрен через кнопку `Вернуться` или нажатием кнопки `ESC` на клавиатуре.

#### Работа на мобильных устройствах 
Для проверки использовлось Android устройство. Дополнительно в ссылках на тестовые потоки необходимо сменить `localhost` на ip-адрес компьютера в сети, который раздает эти потоки.
