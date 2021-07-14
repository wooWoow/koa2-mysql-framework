import Adafruit_DHT
import time


# Set sensor type : Options are DHT11,DHT22 or AM2302

sensor=Adafruit_DHT.DHT22


# Set GPIO sensor is connected to

gpio=23
 

# Use read_retry method. This will retry up to 15 times to

# get a sensor reading (waiting 2 seconds between each retry).

humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio)

  

# Reading the DHT11 is very sensitive to timings and occasionally

# the Pi might fail to get a valid reading. So check if readings are valid.

if humidity is not None and temperature is not None:

  now = time.localtime()
  nowt = time.strftime("%Y-%m-%d %H:%M:%S", now)
  print("Success +++ %-3.1f +++ %-3.1f +++ %s" % ( temperature, humidity, nowt))

else:

  print('Failed to get reading. Try again!')
