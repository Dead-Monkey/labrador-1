export let lvlConfig = {
  'lvlId': 101,
  'firstEnter': true,
  'enterPoint': {
    x: 0,
    y: 2
  },
  'cellSize': 30,
  'moveSpeed': 500
}
export let items = {
  users: [701],
  items: [301, 301, 302],
  mobs: [401, 401, 401, 402]
}
export let mapModel = [
  [[205], [205], [205], [205], [205], [205], [205], [205], [205]],
  [[205], [101], [101], [205], [205], [205], [101], [101], [205]],
  [[101, this.items.users[0]], [101], [205], [101], [101, this.items.mobs[0]], [101, this.items.items[2]], [101], [101], [205]],
  [[205], [101], [205], [205], [205], [101], [101], [101], [205]],
  [[205], [101], [101], [205], [205], [101], [101], [101, this.items.mobs[1]], [205]],
  [[205], [205], [101], [101, this.items.items[0]], [101], [101, this.items.items[1]], [101], [205]],
  [[205], [205], [101], [205], [101], [205], [101], [101], [205]],
  [[205], [205], [101, this.items.mobs[2]], [205], [101], [101], [205], [101, this.items.mobs[3]], [205]],
  [[205], [205], [205], [205], [205], [205], [101], [205], [205]],
  [[205], [205], [205], [205], [205], [205], [205], [205], [205]]
]
