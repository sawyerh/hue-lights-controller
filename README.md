# Getting started

1. [Get the IP address of your Hue Bridge and generate a username](https://developers.meethue.com/develop/get-started-2/)
1. Install dependencies: `npm install`
1. Run the script, passing in the IP address and username from step 1:
  ```sh
  HUE_IP={IP_GOES_HERE} HUE_USER={USERNAME_GOES_HERE} npm start
  ```

----

# Messy development notes

## Hue documentation
- https://developers.meethue.com/develop/get-started-2/
- https://developers.meethue.com/develop/get-started-2/core-concepts/
- https://developers.meethue.com/develop/hue-api/lights-api/

API endpoint: `http://192.168.1.2/api/{{username}}` (the IP address needs to be discovered through your router – yours might be different)

# Tips

## Don’t Always Send ‘ON’

> Once you have sent the ‘ON’ attribute to a light, it will stay on. Do not repeatedly send the ‘ON’ command as this will slow the responsiveness of the bridge.

## Max. Number of Commands per Second

> You can send commands to the lights too fast. If you stay roughly around 10 commands per second to the /lights resource as maximum you should be fine. For /groups commands you should keep to a maximum of 1 per second.

# API

## Creating a new user

1. Send `POST /api` with body `{"devicetype":"foobar"}`
1. You'll get an error in return, that's okay.
1. Press the button on the Hue Bridge
1. Send the request again

## Listing lights and groups

```
GET http://{{ip}}/api/{{username}}
```

## Updating a light

```
PUT http://{{ip}}/api/{{username}}/lights/{{id}}/state

{"on": true, "bri": 77}
```