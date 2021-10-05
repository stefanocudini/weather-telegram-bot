# weather bot

weather telegram bot  in NodeJs

## setup

create ```.env``` file containts

```
BOT_TOKEN=XXXXXXXXXXXXXXXXXX

WU_APIKEY=XXXXXXXXXXXXXXXXXX

AUTHOR=@admin_username

```

## run in docker

```bash
docker-compose up
```


- BOT_TOKEN: https://t.me/BotFather

- WU_APIKEY: https://www.wunderground.com/member/api-keys

# usage

```bash
npm install
npm start
```


## requirements

docker, docker-compose.

Running in nodejs this library used to renderize web pages:
https://github.com/puppeteer/puppeteer

```bash
sudo apt-get install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \ 
	 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
	 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
	 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
	 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
	 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 \
	 libnss3 lsb-release xdg-utils
```
