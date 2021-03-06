import { Injectable } from '@angular/core';

import { MainUserService } from '../../../users'
import { ItemsService, Item, Mob } from '../items'
import { StorageService } from '../../../shared'
import * as lvl_101 from './101'

@Injectable()
export class LevelsService {
  /*TODO save list to memory and get him from memory in next enters*/
  private lvlsList: Object = {
    101: lvl_101
  }
  private currentLevel;
  private mapModel;
  private lvlConfig;
  private lvlMobs = []
  private lvlItems = [];
  private DBKeys = {
    map: 'map'
  }
  constructor(private userServe: MainUserService, private itemsServe: ItemsService, private storageServe: StorageService) {
    this.currentLevel = this.userServe.getCurrentLevel()
    this.mapModel = this.lvlsList[this.currentLevel].mapModel
    this.lvlConfig = this.lvlsList[this.currentLevel].lvlConfig
    // for (let variable of this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`).map) {
    //   for (let it of variable) {
    //     if (it[1] && it[1].name === 'user') {
    //       console.log(it[1]);
    //     }
    //   }
    // }
    // if (this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`)) {
    //   this.mapModel = this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`).map
    //   this.lvlConfig = this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`).config
    //
    //   // console.log(this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`).map, this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`).cofig);
    // }else{
    // }

  }
  getCurrentLevel() {
    return this.currentLevel
  }
  changeLevel(lvl: number) {
    if (lvl in this.lvlsList) {
      this.currentLevel = lvl
      this.userServe.setCurrentLevel(lvl)
    } else {
      console.log(`nope`);
    }
  }
  getLevelConfig() {
    return this.lvlConfig
  }
  getLevelItems() {
    return this.lvlItems
  }
  getLevelMobs() {
    return this.lvlMobs
  }
  getLevelMapModel() {
    return this.mapModel
  }
  getLevelsCount() {
    let count
    for (let key in this.lvlsList) {
      count++
    }
    return count
  }
  getFirstEnter() {
    return this.lvlConfig.firstEnter
  }
  checkFirstEnter() {
    this.lvlConfig.firstEnter = false
  }
  // firstEnter to map
  /*  TODO save to memory*/
  changeMap() {
    if (this.lvlConfig.firstEnter) {
      for (let variable of this.mapModel) {
        for (let item of variable) {
          if (item[1]) {
            let it = item[1].toString(),
              res
            switch (it[0]) {
              //users
              case '7':
                item.splice(1, 1, this.userServe)
                break;
              //items/mobs
              case '3':
              case '4':
                if (!this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`)) {
                  res = this.itemsServe.createItem(it[0], it[1], it[2], { x: variable.indexOf(item), y: this.mapModel.indexOf(variable) })
                  item.splice(1, 1, res)
                  if (it[0] === '3') {
                    this.lvlItems.push(res)
                  } else if (it[0] === '4') {
                    this.lvlMobs.push(res)
                  }
                } else {
                  item.splice(1, 1)
                }
                break;
              default:
                console.log(`CHANGE MAP: dont have case:${it[0]}`);
                break;
            }
          }
        }
      }
      if (this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`)) {
        this.deserializationItemobs()
      }

    } else {
      for (let variable of this.mapModel) {
        for (let item of variable) {
          if (item[1]) {
            let res
            if (item[1] instanceof MainUserService || Item || Mob) {
              if ((item[1].getPosition().x != variable.indexOf(item)) || (item[1].getPosition().y != this.mapModel.indexOf(variable))) {
                res = item.splice(1, 1)
                this.mapModel[res[0].getPosition().y][res[0].getPosition().x].push(res[0])
              }
            }
          }
        }
      }
      this.saveToDB()
    }
  }
  deserializationItemobs() {
    let res;
      let db = this.storageServe.getItem(`${this.DBKeys.map}${this.currentLevel}`)
      if (db.mobs && db.mobs.length) {
        for (let mob of db.mobs) {
          res = this.itemsServe.createItem('4', mob.type, mob.mod, { x: mob.position.x, y: mob.position.y })
          this.lvlMobs.push(res)
          this.mapModel[res.getPosition().y][res.getPosition().x].push(res)
        }
      }
      if (db.items && db.items.length) {
        for (let variable of db.items) {
          res = this.itemsServe.createItem('3', variable.type, variable.mod, { x: variable.position.x, y: variable.position.y })
          this.lvlItems.push(res)
          this.mapModel[res.getPosition().y][res.getPosition().x].push(res)
        }
      }
  }
  removeItem(item) {
    let res
    if (item instanceof Mob) {
      for (let variable of this.lvlMobs) {
        if (variable.id === item.id) {
          res = this.lvlMobs.splice(this.lvlMobs.indexOf(variable), 1)
          this.mapModel[res[0].getPosition().y][res[0].getPosition().x].splice(1, 1)
        }
      }
    } else if (item instanceof Item) {
      for (let variable of this.lvlItems) {
        if (variable.id === item.id) {
          res = this.lvlItems.splice(this.lvlItems.indexOf(variable), 1)
          this.mapModel[res[0].getPosition().y][res[0].getPosition().x].splice(1, 1)
        }
      }
    } else {
      console.log(`cant remove item: ${item}`);
    }
  }
  private saveToDB() {
    let res = {
      mobs: this.lvlMobs,
      items: this.lvlItems
    }
    this.storageServe.setItem(`${this.DBKeys.map}${this.currentLevel}`, res)
  }
  //TODO save to mamory positions after prepare, move, changes
}
