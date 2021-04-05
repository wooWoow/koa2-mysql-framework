import RPi.GPIO as GPIO
import dht11
import time

# initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.cleanup()

# read data using pin 14
instance = dht11.DHT11(pin = 18)
result = instance.read()

if result.is_valid():
    now = time.localtime()
    nowt = time.strftime("%Y-%m-%d %H:%M:%S", now)
    print("Success +++ %-3.1f +++ %-3.1f +++ %s" % ( result.temperature, result.humidity, nowt))
else:
    print("Error: %d" % result.error_code)