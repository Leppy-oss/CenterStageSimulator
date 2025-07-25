/**
 *  _____  _____ _   _ _____ ___________  _____ _____ ___  _____  _____   _____ ________  ____   _ _       ___ _____ ___________ 
 * /  __ \|  ___| \ | |_   _|  ___| ___ \/  ___|_   _/ _ \|  __ \|  ___| /  ___|_   _|  \/  | | | | |     / _ \_   _|  _  | ___ \
 * | /  \/| |__ |  \| | | | | |__ | |_/ /\ `--.  | |/ /_\ \ |  \/| |__   \ `--.  | | | .  . | | | | |    / /_\ \| | | | | | |_/ /
 * | |    |  __|| . ` | | | |  __||    /  `--. \ | ||  _  | | __ |  __|   `--. \ | | | |\/| | | | | |    |  _  || | | | | |    / 
 * | \__/\| |___| |\  | | | | |___| |\ \ /\__/ / | || | | | |_\ \| |___  /\__/ /_| |_| |  | | |_| | |____| | | || | \ \_/ / |\ \ 
 * \____/\____/\_| \_/ \_/ \____/\_| \_|\____/  \_/\_| |_/\____/\____/  \____/ \___/\_|  |_/\___/\_____/\_| |_/\_/  \___/\_| \_|
 *                                                                                                                               
 *                                                                                                                            
 * ______              _     _____         _           _      _           _         _____  _____  ____  _____                    
 * | ___ \            | |   |_   _|       | |         (_)    | |         | |       |  _  ||  ___|/ ___||  ___|                   
 * | |_/ / __ ___   __| |     | | ___  ___| |__  _ __  _  ___| |__   ___ | |_ ___   \ V / |___ \/ /___ |___ \                    
 * |  __/ '__/ _ \ / _` |     | |/ _ \/ __| '_ \| '_ \| |/ __| '_ \ / _ \| __/ __|  / _ \     \ \ ___ \    \ \                   
 * | |  | | | (_) | (_| |_    | |  __/ (__| | | | | | | | (__| |_) | (_) | |_\__ \ | |_| |/\__/ / \_/ |/\__/ /                   
 * \_|  |_|  \___/ \__,_(_)   \_/\___|\___|_| |_|_| |_|_|\___|_.__/ \___/ \__|___/ \_____/\____/\_____/\____/                    
 *                                                                                                                           
 *                                                                                                                            
 *  _____  _____  _____   ___                                                                                                    
 * / __  \|  _  |/ __  \ /   |                                                                                                   
 * `' / /'| |/' |`' / /'/ /| |                                                                                                   
 *   / /  |  /| |  / / / /_| |                                                                                                   
 * ./ /___\ |_/ /./ /__\___  |                                                                                                   
 * \_____/ \___/ \_____/   |_/                                                                                                                         
 */

import Phaser from 'phaser'

import HomeScreen from './HomeScreen'
import { GameDimensions } from './HomeScreen'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: GameDimensions[0],
	height: GameDimensions[1],
	physics: {
		default: 'matter',
		matter: {
			debug: false,
		},
	},
	scene: [HomeScreen],
}

export default new Phaser.Game(config)

console.log(`
----------------------------------------------------------------------------
╭━━━┳━━━┳━╮╱╭┳━━━━┳━━━┳━━━┳━━━┳━━━━┳━━━┳━━━┳━━━╮╭━━━┳━━┳━╮╭━┳╮╱╭┳╮╱╱╭━━━┳━━━━┳━━━┳━━━╮
┃╭━╮┃╭━━┫┃╰╮┃┃╭╮╭╮┃╭━━┫╭━╮┃╭━╮┃╭╮╭╮┃╭━╮┃╭━╮┃╭━━╯┃╭━╮┣┫┣┫┃╰╯┃┃┃╱┃┃┃╱╱┃╭━╮┃╭╮╭╮┃╭━╮┃╭━╮┃
┃┃╱╰┫╰━━┫╭╮╰╯┣╯┃┃╰┫╰━━┫╰━╯┃╰━━╋╯┃┃╰┫┃╱┃┃┃╱╰┫╰━━╮┃╰━━╮┃┃┃╭╮╭╮┃┃╱┃┃┃╱╱┃┃╱┃┣╯┃┃╰┫┃╱┃┃╰━╯┃
┃┃╱╭┫╭━━┫┃╰╮┃┃╱┃┃╱┃╭━━┫╭╮╭┻━━╮┃╱┃┃╱┃╰━╯┃┃╭━┫╭━━╯╰━━╮┃┃┃┃┃┃┃┃┃┃╱┃┃┃╱╭┫╰━╯┃╱┃┃╱┃┃╱┃┃╭╮╭╯
┃╰━╯┃╰━━┫┃╱┃┃┃╱┃┃╱┃╰━━┫┃┃╰┫╰━╯┃╱┃┃╱┃╭━╮┃╰┻━┃╰━━╮┃╰━╯┣┫┣┫┃┃┃┃┃╰━╯┃╰━╯┃╭━╮┃╱┃┃╱┃╰━╯┃┃┃╰╮
╰━━━┻━━━┻╯╱╰━╯╱╰╯╱╰━━━┻╯╰━┻━━━╯╱╰╯╱╰╯╱╰┻━━━┻━━━╯╰━━━┻━━┻╯╰╯╰┻━━━┻━━━┻╯╱╰╯╱╰╯╱╰━━━┻╯╰━╯
╭━━━╮╱╱╱╱╱╱╭╮╱╭╮╱╱╭━━━┳━━━┳━━━┳╮╱╱╭╮╱╭━━━┳━━━┳━━━╮
┃╭━╮┃╱╱╱╱╱╱┃┃╱┃┃╱╱┃╭━━┫╭━╮┃╭━╮┃╰╮╭╯┃╱┃╭━╮┃╭━╮┃╭━╮┃
┃╰━╯┣━┳━━┳━╯┃╱┃┃╱╱┃╰━━┫╰━╯┃╰━╯┣╮╰╯╭╯╱┃┃╱┃┃╰━━┫╰━━╮
┃╭━━┫╭┫╭╮┃╭╮┃╱┃┃╱╭┫╭━━┫╭━━┫╭━━╯╰╮╭╋━━┫┃╱┃┣━━╮┣━━╮┃
┃┃╱╱┃┃┃╰╯┃╰╯┣╮┃╰━╯┃╰━━┫┃╱╱┃┃╱╱╱╱┃┃╰━━┫╰━╯┃╰━╯┃╰━╯┃
╰╯╱╱╰╯╰━━┻━━┻╯╰━━━┻━━━┻╯╱╱╰╯╱╱╱╱╰╯╱╱╱╰━━━┻━━━┻━━━╯
╱╱╭━╮╭━╮╱╱╭━━━┳━━━┳━━━┳╮╱╭╮╭━━━━╮╱╱╱╱╭╮╱╱╱╱╱╱╱╱╭╮╱╱╱╱╭╮╱╱╱╱╭━━━┳━━━┳━━━┳━━━╮
╱╭╯╭╯╰╮╰╮╱┃╭━╮┃╭━╮┃╭━╮┃┃╱┃┃┃╭╮╭╮┃╱╱╱╱┃┃╱╱╱╱╱╱╱╱┃┃╱╱╱╭╯╰╮╱╱╱┃╭━╮┃╭━━┫╭━━┫╭━━╯
╭╯╭╋━━╋╮╰╮╰╯╭╯┃┃┃┃┣╯╭╯┃╰━╯┃╰╯┃┃┣┻━┳━━┫╰━┳━╮╭┳━━┫╰━┳━┻╮╭╋━━╮┃╰━╯┃╰━━┫╰━━┫╰━━╮
┃┃┃┃╭━╯┃┃┃╭━╯╭┫┃┃┃┣━╯╭┻━━╮┃╱╱┃┃┃┃━┫╭━┫╭╮┃╭╮╋┫╭━┫╭╮┃╭╮┃┃┃━━┫┃╭━╮┣━━╮┃╭━╮┣━━╮┃
┃┃┃┃╰━╮┃┃┃┃┃╰━┫╰━╯┃┃╰━╮╱╱┃┃╱╱┃┃┃┃━┫╰━┫┃┃┃┃┃┃┃╰━┫╰╯┃╰╯┃╰╋━━┃┃╰━╯┣━━╯┃╰━╯┣━━╯┃
╰╮╰╋━━╋╯╭╯╰━━━┻━━━┻━━━╯╱╱╰╯╱╱╰╯╰━━┻━━┻╯╰┻╯╰┻┻━━┻━━┻━━┻━┻━━╯╰━━━┻━━━┻━━━┻━━━╯
╱╰╮╰╮╭╯╭╯
╱╱╰━╯╰━╯
----------------------------------------------------------------------------
`);