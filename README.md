# xbox-gold
Check for new Xbox Gold games


## How to use
````
git clone https://github.com/joshstrange/xbox-gold.git
cd xbox-gold
npm install
cp config.sample.js config.js
$EDITOR config.js
````

Put in your Pushover App token ([Create one here](https://pushover.net/apps/build)) and your use token ([Get yours here](https://pushover.net/)). You can also adjust the windows for receiving the notifications. By default it will send you an alert the first 2 days and last 2 days a game is free. I wish there was a way to pull a list of a users games and only alert if they haven't already downloaded it but there isn't :( 

Add this script to run in your cron, I run mine once a day at 10am:

````
0 10 * * * /path/to/node /path/to/checkout/index.js >> /path/to/checkout/xbox-gold.log 2>&1
````

