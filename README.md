# ismo-bartender

One of Protacon Hackday 2016 experiments.

Uses webkit speech recognition to parse the user's voice input for drink orders. The order is then
 sent to api.ai for further parsing, so that an order can be formed and sent to a Firebase database.
 
 A separate raspberry pi implementation was made for fetching the orders from the Firebase database 
  and dispensing it.