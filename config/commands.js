/**
 * Commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *   birkal: function(target, room, user) {
 *     this.sendReply("It's not funny anymore.");
 *   },
 *
 * Commands are actually passed five parameters:
 *   function(target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will set it up so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message)
 *   Checks to see if the user can say the message. In addition to
 *   running the checks from this.canTalk(), it also checks to see if
 *   the message has any banned words or is too long. Returns the
 *   filtered message, or a falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *
 * this.splitTarget(target)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	getip: 'whois',
	rooms: 'whois',
	altcheck: 'whois',
	alt: 'whois',
	alts: 'whois',
	getalts: 'whois',
	whois: function(target, room, user) {
		var targetUser = this.targetUserOrSelf(target);
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}

		this.sendReply('User: '+targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts();
			var output = '';
			for (var i in targetUser.prevNames) {
				if (output) output += ", ";
				output += targetUser.prevNames[i];
			}
			if (output) this.sendReply('Previous names: '+output);

			for (var j=0; j<alts.length; j++) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (targetAlt.group === '~' && user.group !== '~') continue;

				this.sendReply('Alt: '+targetAlt.name);
				output = '';
				for (var i in targetAlt.prevNames) {
					if (output) output += ", ";
					output += targetAlt.prevNames[i];
				}
				if (output) this.sendReply('Previous names: '+output);
			}
		}
		if (config.groups[targetUser.group] && config.groups[targetUser.group].name) {
			this.sendReply('Group: ' + config.groups[targetUser.group].name + ' (' + targetUser.group + ')');
		}
		if (targetUser.isSysop) {
			this.sendReply('(Pok\xE9mon Showdown System Operator)');
		}
		if (!targetUser.authenticated) {
			this.sendReply('(Unregistered)');
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply('IP' + ((ips.length > 1) ? 's' : '') + ': ' + ips.join(', '));
		}
		var output = 'In rooms: ';
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += ' | ';
			first = false;

			output += '<a href="/'+i+'" room="'+i+'">'+i+'</a>';
		}
		this.sendReply('|raw|'+output);
	},

	ipsearch: function(target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP "+target+":");
		for (var userid in Users.users) {
			var user = Users.users[userid];
			if (user.latestIp === target) {
				this.sendReply((user.connected?"+":"-")+" "+user.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	 invite: function(target, room, user) {
	 	target = this.splitTarget(target);
	 	if (!this.targetUser) {
	 		return this.sendReply('User '+this.targetUsername+' not found.');
	 	}
	 	var roomid = (target || room.id);
	 	if (!Rooms.get(roomid)) {
	 		return this.sendReply('Room '+roomid+' not found.');
	 	}
	 	return this.parse('/msg '+this.targetUsername+', /invite '+roomid);
	 },

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	data: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var data = '';
		var targetId = toId(target);
		var newTargets = Tools.dataSearch(target);
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; i++) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					data = "No Pokemon, item, move or ability named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				data += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
			}
		} else {
			data = "No Pokemon, item, move or ability named '" + target + "' was found. (Check your spelling?)";
		}

		this.sendReply(data);
	},

	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1,'ou':1,'lc':1,'cap':1,'bl':1};
		var allColours = {'green':1,'red':1,'blue':1,'white':1,'brown':1,'yellow':1,'purple':1,'pink':1,'gray':1,'black':1};
		var showAll = false;
		var megaSearch = null;
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0,1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReply('Specify only one ability.');
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReply('A search with the parameter "all" cannot be broadcast.');
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				megaSearch = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReply('Specify a maximum of two types.');
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReply('Specify a maximum of 4 moves.');
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			} else {
				return this.sendReply('"' + target + '" could not be found in any of the search categories.');
			}
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null) return this.sendReply('No search parameters other than "all" were found.\nTry "/help dexsearch" for more information on this command.');

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			if (template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) && 
				(megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega))) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1,'types':1,'ability':1,'tier':1,'gen':1,'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox('"' + move + '" is not a known move.');
							var canLearn = (template.learnset.sketch && !(move.id in {'chatter':1,'struggle':1,'magikarpsrevenge':1})) || template.learnset[move.id];
							if (!canLearn && searches[search][i]) delete dex[mon];
							else if (searches[search][i] === false && canLearn) dex[mon] = false;
						}
					}
					for (var mon in dex) {
						if (dex[mon] && dex[mon].evos.length) {
							for (var evo in dex[mon].evos) if (dex[dex[mon].evos[evo]] !== false) dex[dex[mon].evos[evo]] = Tools.getTemplate(dex[mon].evos[evo]);
						}
						if (!dex[mon]) delete dex[mon];
					}
					break;

				default:
					return this.sendReply("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function(speciesid) {return dex[speciesid].species;});
		var resultsStr = '';
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(', ');
			} else {
				results.sort(function(a,b) {return Math.round(Math.random());});
				resultsStr = results.slice(0, 10).join(', ') + ', and ' + string(results.length - output) + ' more. Redo the search with "all" as a search parameter to show all results.';
			}
		} else {
			resultsStr = 'No Pokémon found.';
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply('Pokemon "'+template.id+'" not found.');
		}

		if (targets.length < 2) {
			return this.sendReply('You must specify at least one move.');
		}

		for (var i=1, len=targets.length; i<len; i++) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply('Move "'+move.id+'" not found.');
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = ''+template.name+(problem?" <span class=\"message-learn-cannotlearn\">can't</span> learn ":" <span class=\"message-learn-canlearn\">can</span> learn ")+(targets.length>2?"these moves":move.name);
		if (!problem) {
			var sourceNames = {E:"egg",S:"event",D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				for (var i=0, len=sources.length; i<len; i++) {
					var source = sources[i];
					if (source.substr(0,2) === prevSourceType) {
						if (prevSourceCount < 0) buffer += ": "+source.substr(2);
						else if (all || prevSourceCount < 3) buffer += ', '+source.substr(2);
						else if (prevSourceCount == 3) buffer += ', ...';
						prevSourceCount++;
						continue;
					}
					prevSourceType = source.substr(0,2);
					prevSourceCount = source.substr(2)?0:-1;
					buffer += "<li>gen "+source.substr(0,1)+" "+sourceNames[source.substr(1,1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": "+source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before "+(lsetData.sourcesBefore+1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	weakness: function(target, room, user){
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox(target + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				if (typeMod == 1) weaknesses.push(type);
				if (typeMod == 2) weaknesses.push("<b>" + type + "</b>");
			}
		});

		if (!weaknesses.length) {
			this.sendReplyBox(target + " has no weaknesses.");
		} else {
			this.sendReplyBox(target + " is weak to: " + weaknesses.join(', ') + " (not counting abilities).");
		}
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function(target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i=0; i<2; i++) {
			for (var method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species+" (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				factor = Math.pow(2, Tools.getEffectiveness(source, defender));
			} else {
				factor = 1;
			}
		}

		this.sendReplyBox(atkName+" is "+factor+"x effective against "+defName+".");
	},

	uptime: function(target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24*60*60) {
			var uptimeDays = Math.floor(uptime/(24*60*60));
			uptimeText = ''+uptimeDays+' '+(uptimeDays == 1 ? 'day' : 'days');
			var uptimeHours = Math.floor(uptime/(60*60)) - uptimeDays*24;
			if (uptimeHours) uptimeText += ', '+uptimeHours+' '+(uptimeHours == 1 ? 'hour' : 'hours');
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox('Uptime: <b>'+uptimeText+'</b>');
	},

	groups: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('+ <b>Voice</b> - They can use ! commands like !groups, and talk during moderated chat<br />' +
			'% <b>Driver</b> - The above, and they can mute. Global % can also lock users and check for alts<br />' +
			'@ <b>Moderator</b> - The above, and they can ban users<br />' +
			'&amp; <b>Leader</b> - The above, and they can promote to moderator and force ties<br />' +
			'~ <b>Administrator</b> - They can do anything, like change what this message says<br />' +
			'# <b>Room Owner</b> - They are administrators of the room and can almost totally control it');
	},

	website: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(' <b>Website League</b> - <a href="http://leaf-league.weebly.com/">Click Here</a><br />');
	},

	forum: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(' <b>League Forum</b> - <a href="http://leaf-league.forumotion.com/">Click Here</a> Fourm<br />');

	},


	opensource: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown is open source:<br />- Language: JavaScript<br />- <a href="https://github.com/Zarel/Pokemon-Showdown/commits/master">What\'s new?</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown">Server source code</a><br />- <a href="https://github.com/Zarel/Pokemon-Showdown-Client">Client source code</a>');
	},

	avatars: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Your avatar can be changed using the Options menu (it looks like a gear) in the upper right of Pokemon Showdown. Custom avatars are only obtainable by staff.');
	},

	introduction: 'intro',
	intro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('New to competitive pokemon?<br />' +
			'- <a href="http://www.smogon.com/forums/threads/3496279/">Beginner\'s Guide to Pokémon Showdown</a><br />' +
			'- <a href="http://www.smogon.com/dp/articles/intro_comp_pokemon">An introduction to competitive Pokémon</a><br />' +
			'- <a href="http://www.smogon.com/bw/articles/bw_tiers">What do "OU", "UU", etc mean?</a><br />' +
			'- <a href="http://www.smogon.com/xyhub/tiers">What are the rules for each format? What is "Sleep Clause"?</a>');
	},

	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Welcome to Smogon\'s Official Pokémon Showdown server! The Mentoring room can be found ' + 
			'<a href="http://play.pokemonshowdown.com/mentoring">here</a> or by using /join mentoring.<br /><br />' +
			'Here are some useful links to Smogon\'s Mentorship Program to help you get integrated into the community:<br />' +
			'- <a href="http://www.smogon.com/mentorship/primer">Smogon Primer: A brief introduction to Smogon\'s subcommunities</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/introductions">Introduce yourself to Smogon!</a><br />' +
			'- <a href="http://www.smogon.com/mentorship/profiles">Profiles of current Smogon Mentors</a><br />' +
			'- <a href="http://mibbit.com/#mentor@irc.synirc.net">#mentor: the Smogon Mentorship IRC channel</a><br />' +
			'All of these links and more can be found at the <a href="http://www.smogon.com/mentorship/">Smogon Mentorship Program\'s hub</a>.');
	},

	calculator: 'calc',
	calc: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />' +
			'- <a href="http://pokemonshowdown.com/damagecalc/">Damage Calculator</a>');
	},

	cap: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('An introduction to the Create-A-Pokemon project:<br />' +
			'- <a href="http://www.smogon.com/cap/">CAP project website and description</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=48782">What Pokemon have been made?</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3464513">Talk about the metagame here</a><br />' +
			'- <a href="http://www.smogon.com/forums/showthread.php?t=3466826">Practice BW CAP teams</a>');
	},

	gennext: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />' +
			'- <a href="https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md">README: overview of NEXT</a><br />' +
			'Example replays:<br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37815908">roseyraid vs Zarel</a><br />' +
			'- <a href="http://pokemonshowdown.com/replay/gennextou-37900768">QwietQwilfish vs pickdenis</a>');
	},

	om: 'othermetas',
	othermetas: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/forums/206/">Information on the Other Metagames</a><br />';
		}
		if (target === 'all' || target === 'hackmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3475624/">Hackmons</a><br />';
		}
		if (target === 'all' || target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3463764/">Balanced Hackmons</a><br />';
		}
		if (target === 'all' || target === 'glitchmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3467120/">Glitchmons</a><br />';
		}
		if (target === 'all' || target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3479358/">Tier Shift</a><br />';
		}
		if (target === 'all' || target === 'seasonal') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/sim/seasonal">Seasonal Ladder</a><br />';
		}
		if (target === 'all' || target === 'stabmons') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3484106/">STABmons</a>';
		}
		if (target === 'all' || target === 'omotm' || target === 'omofthemonth' || target === 'month') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/3481155/">OM of the Month</a>';
		}
		if (target === 'all' || target === 'index') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/forums/threads/other-metagames-index.3472405/">OM Index</a><br />';
		}
		if (!matched) {
			return this.sendReply('The Other Metas entry "'+target+'" was not found. Try /othermetas or /om for general help.');
		}
		this.sendReplyBox(buffer);
	},

	roomhelp: function(target, room, user) {
		if (room.id === 'lobby') return this.sendReply('This command is too spammy for lobby.');
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Room drivers (%) can use:<br />' +
			'- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />' +
			'- /mute OR /m <em>username</em>: 7 minute mute<br />' +
			'- /hourmute OR /hm <em>username</em>: 60 minute mute<br />' +
			'- /unmute <em>username</em>: unmute<br />' +
			'- /announce OR /wall <em>message</em>: make an announcement<br />' +
			'<br />' +
			'Room moderators (@) can also use:<br />' +
			'- /roomban OR /rb <em>username</em>: bans user from the room<br />' +
			'- /roomunban <em>username</em>: unbans user from the room<br />' +
			'- /roomvoice <em>username</em>: appoint a room voice<br />' +
			'- /roomdevoice <em>username</em>: remove a room voice<br />' +
			'- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />' +
			'<br />' +
			'Room owners (#) can also use:<br />' +
			'- /roomdesc <em>description</em>: set the room description on the room join page<br />' +
			'- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />' +
			'- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />' +
			'- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />' +
			'- /modchat <em>[%/@/#]</em>: set modchat level<br />' +
			'- /declare <em>message</em>: make a global declaration<br />' +
			'</div>');
	},

	restarthelp: function(target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox('The server is restarting. Things to know:<br />' +
			'- We wait a few minutes before restarting so people can finish up their battles<br />' +
			'- The restart itself will take around 0.6 seconds<br />' +
			'- Your ladder ranking and teams will not change<br />' +
			'- We are restarting to update Pokémon Showdown to a newer version' +
			'</div>');
	},

	rule: 'rules',
	rules: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox('Please follow the rules:<br />' +
			(room.rulesLink ? '- <a href="' + sanitize(room.rulesLink) + '">' + sanitize(room.title) + ' room rules</a><br />' : '') +
			'- <a href="http://pokemonshowdown.com/rules">'+(room.rulesLink?'Global rules':'Rules')+'</a><br />' +
			'</div>');
			return;
		}
		if (!this.can('roommod', null, room)) return;
		if (target.length > 80) {
			return this.sendReply('Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.');
		}

		room.rulesLink = target.trim();
		this.sendReply('(The room rules link is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq">Frequently Asked Questions</a><br />';
		}
		if (target === 'all' || target === 'deviation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#deviation">Why did this user gain or lose so many points?</a><br />';
		}
		if (target === 'all' || target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#doubles">Can I play doubles/triples/rotation battles here?</a><br />';
		}
		if (target === 'all' || target === 'randomcap') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#randomcap">What is this fakemon and what is it doing in my random battle?</a><br />';
		}
		if (target === 'all' || target === 'restarts') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#restarts">Why is the server restarting?</a><br />';
		}
		if (target === 'all' || target === 'staff') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/staff_faq">Staff FAQ</a><br />';
		}
		if (target === 'all' || target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += 'A user is autoconfirmed when they have won at least one rated battle and has been registered for a week or longer.<br />';
		}
		if (!matched) {
			return this.sendReply('The FAQ entry "'+target+'" was not found. Try /faq for general help.');
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function(target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = '';
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/tiers/">Smogon Tiers</a><br />';
			buffer += '- <a href="http://www.smogon.com/forums/threads/tiering-faq.3498332/">Tiering FAQ</a><br />';
			buffer += '- <a href="http://www.smogon.com/bw/banlist/">The banlists for each tier</a><br />';
		}
		if (target === 'all' || target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uber">Uber Pokemon</a><br />';
		}
		if (target === 'all' || target === 'overused' || target === 'ou') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ou">Overused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'underused' || target === 'uu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/uu">Underused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/ru">Rarelyused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/nu">Neverused Pokemon</a><br />';
		}
		if (target === 'all' || target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/tiers/lc">Little Cup Pokemon</a><br />';
		}
		if (target === 'all' || target === 'doubles') {
			matched = true;
			buffer += '- <a href="http://www.smogon.com/bw/metagames/doubles">Doubles</a><br />';
		}
		if (!matched) {
			return this.sendReply('The Tiers entry "'+target+'" was not found. Try /tiers for general help.');
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function(target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox('<a href="http://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/">Generation 6 Analyses Index</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || "bw").trim().toLowerCase();
		var genNumber = 5;
		var doublesFormats = {'vgc2012':1,'vgc2013':1,'doubles':1};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === "bw" || generation === "bw2" || generation === "5" || generation === "five") {
			generation = "bw";
		} else if (generation === "dp" || generation === "dpp" || generation === "4" || generation === "four") {
			generation = "dp";
			genNumber = 4;
		} else if (generation === "adv" || generation === "rse" || generation === "rs" || generation === "3" || generation === "three") {
			generation = "rs";
			genNumber = 3;
		} else if (generation === "gsc" || generation === "gs" || generation === "2" || generation === "two") {
			generation = "gs";
			genNumber = 2;
		} else if(generation === "rby" || generation === "rb" || generation === "1" || generation === "one") {
			generation = "rb";
			genNumber = 1;
		} else {
			generation = "bw";
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1,'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':'VGC 2012 ','vgc2013':'VGC 2013 ','doubles':'Doubles '}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox(pokemon.name+' did not exist in '+generation.toUpperCase()+'!');
			}
			if (pokemon.tier === 'G4CAP' || pokemon.tier === 'G5CAP') {
				generation = "cap";
			}

			var poke = pokemon.name.toLowerCase();
			if (poke === 'nidoranm') poke = 'nidoran-m';
			if (poke === 'nidoranf') poke = 'nidoran-f';
			if (poke === 'farfetch\'d') poke = 'farfetchd';
			if (poke === 'mr. mime') poke = 'mr_mime';
			if (poke === 'mime jr.') poke = 'mime_jr';
			if (poke === 'deoxys-attack' || poke === 'deoxys-defense' || poke === 'deoxys-speed' || poke === 'kyurem-black' || poke === 'kyurem-white') poke = poke.substr(0,8);
			if (poke === 'wormadam-trash') poke = 'wormadam-s';
			if (poke === 'wormadam-sandy') poke = 'wormadam-g';
			if (poke === 'rotom-wash' || poke === 'rotom-frost' || poke === 'rotom-heat') poke = poke.substr(0,7);
			if (poke === 'rotom-mow') poke = 'rotom-c';
			if (poke === 'rotom-fan') poke = 'rotom-s';
			if (poke === 'giratina-origin' || poke === 'tornadus-therian' || poke === 'landorus-therian') poke = poke.substr(0,10);
			if (poke === 'shaymin-sky') poke = 'shaymin-s';
			if (poke === 'arceus') poke = 'arceus-normal';
			if (poke === 'thundurus-therian') poke = 'thundurus-t';

			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/pokemon/'+poke+doublesFormat+'">'+generation.toUpperCase()+' '+doublesText+pokemon.name+' analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/items/'+itemName+'">'+generation.toUpperCase()+' '+item.name+' item analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/abilities/'+abilityName+'">'+generation.toUpperCase()+' '+ability.name+' ability analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox('<a href="http://www.smogon.com/'+generation+'/moves/'+moveName+'">'+generation.toUpperCase()+' '+move.name+' move analysis</a>, brought to you by <a href="http://www.smogon.com">Smogon University</a>');
		}

		if (!atLeastOne) {
			return this.sendReplyBox('Pokemon, item, move, or ability not found for generation ' + generation.toUpperCase() + '.');
		}
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	 crymeariver: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://i.imgur.com/zb2j4qq.gif?1"></center>');
	 },

	 queenofthecastle: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://fc00.deviantart.net/fs70/f/2013/297/1/7/rwby_nora_valkyrie_gif_by_dustiniz117-d6rmph4.gif"></center>');
	 },


	 crushhiswang: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://24.media.tumblr.com/67235f6be8c274a7ce05cb13e8c01c26/tumblr_mnr325ZLN41r0z4fuo2_500.gif"></center>');
	 },

	 firepunch: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://31.media.tumblr.com/d216a9b45ac33766ac621dd36dce891f/tumblr_mnqp5nUxSj1rj8nzio1_400.gif"></center>');
	 },

	 lieren: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://24.media.tumblr.com/50061b7f7abd7013806e56090c4bb03e/tumblr_mryhff94TG1sbu5xto6_400.gif"></center>');
	 },

	 iceblast: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://images1.wikia.nocookie.net/rwby/images/5/59/Tumblr_mik0scCZe41rktwn6o1_500.gif"></center>');
	 },

	 combatskirts: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://25.media.tumblr.com/b74eb164763dce0487564c3ce21b9318/tumblr_mvk84l1WWN1rq5fzso1_500.gif"></center>');
	 },

 	 dexholders: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://i.imgur.com/tR9r9.gif"></center>');
	 },

	 nora: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://25.media.tumblr.com/92f2a57740bc0ad121e0cb87d9836b87/tumblr_msonfrBlq11sgww3vo1_500.gif"></center>');
	 },

	 rockshurt: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://31.media.tumblr.com/b86cf32cad9df3e1c31e67c678a443a5/tumblr_muli1oVcqm1qzkj9ko3_500.gif"></center>');
	 },

	 owch: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://25.media.tumblr.com/c2a1162d3986dffa65e437641284edc6/tumblr_muli1oVcqm1qzkj9ko1_500.gif"></center>');
	 },

	 treessuck: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://media.tumblr.com/32710e9bfca046da6e4514c6fcc82b23/tumblr_inline_ms1l71n1ii1qz4rgp.gif"></center>');
	 },

	 throw: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://31.media.tumblr.com/0b63717080612b951cd76bb8fbe222f5/tumblr_muli1oVcqm1qzkj9ko4_500.gif"></center>');
	 },

	 spoilerwarning: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://static3.wikia.nocookie.net/__cb20131031233004/rwby/images/b/b0/The_Stray_00033.png"></center>');
	 },

	 iburn: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://i.minus.com/idK6YE40trRue.gif"></center>');
	 },

	 comeatme: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://31.media.tumblr.com/tumblr_lrzvrmMDMl1r1l46do1_500.gif"></center>');
	 },

	 wukong: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://i145.photobucket.com/albums/r239/FM_Nocturna/bth_rwby-sun_zps1b425c62.gif"></center>');
	 },
	 
	 adam: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://i.minus.com/iUTbYOS2OZ56y.gif"></center>');
	 },
	 	 
	 ama: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://images4.fanpop.com/image/photos/16900000/Okami-Animated-Gif-s-okami-amaterasu-16966304-320-225.gif"></center>');
	 },
	 	 	 
	 kissandmakeup: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://static.tumblr.com/163f6e361ace5ed3ab961a6700abbd15/auelhnj/nf4mrcg1x/tumblr_static_kiss.gif"></center>');
	 },
	 	 	 
	 demon: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://img837.imageshack.us/img837/3570/blaze.gif"></center>');
	 },
	 	 	 	 
	 lyn: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://lparchive.org/Fire-Emblem-Blazing-Sword/Update%2041/72-solkatti.gif"></center>');
	 },
	 	 	 	 	 
	 lucina: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://24.media.tumblr.com/e96224e07e1d1c28a9c6d2f1846e2153/tumblr_mqtaxjird31r1fq7do2_400.gif"></center>');
	 },

	 birkal: function(target, room, user) {
	 	this.sendReply("It's not funny anymore.");
	 },
	 
         yay: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	return this.sendReply('|raw|<center><img width="300" height="169" src="http://stream1.gifsoup.com/view8/4716472/pokespe-boys-o.gif"></center>');
	 },

	 potd: function(target, room, user) {
	 	if (!this.can('potd')) return false;

	 	config.potd = target;
	 	Simulator.SimulatorProcess.eval('config.potd = \''+toId(target)+'\'');
	 	if (target) {
	 		if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day is now '+target+'!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>');
	 		this.logModCommand('The Pokemon of the Day was changed to '+target+' by '+user.name+'.');
	 	} else {
	 		if (Rooms.lobby) Rooms.lobby.addRaw('<div class="broadcast-blue"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>');
	 		this.logModCommand('The Pokemon of the Day was removed by '+user.name+'.');
	 	}
	 },

	 roll: 'dice',
	 dice: function(target, room, user) {
	 	if (!this.canBroadcast()) return;
	 	var d = target.indexOf("d");
	 	if (d != -1) {
	 		var num = parseInt(target.substring(0,d));
	 		faces = NaN;
	 		if (target.length > d) var faces = parseInt(target.substring(d + 1));
	 		if (isNaN(num)) num = 1;
	 		if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
	 		if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
	 		if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
	 		var rolls = new Array();
	 		var total = 0;
	 		for (var i=0; i < num; i++) {
	 			rolls[i] = (Math.floor(faces * Math.random()) + 1);
	 			total += rolls[i];
	 		}
	 		return this.sendReplyBox('Random number ' + num + 'x(1 - ' + faces + '): ' + rolls.join(', ') + '<br />Total: ' + total);
	 	}
	 	if (target && isNaN(target) || target.length > 21) return this.sendReply('The max roll must be a number under 21 digits.');
	 	var maxRoll = (target)? target : 6;
	 	var rand = Math.floor(maxRoll * Math.random()) + 1;
	 	return this.sendReplyBox('Random number (1 - ' + maxRoll + '): ' + rand);
	 },

	 register: function() {
	 	if (!this.canBroadcast()) return;
	 	this.sendReply("You must win a rated battle to register.");
	 },

	 br: 'banredirect',
	 banredirect: function(){ 
	 	this.sendReply('/banredirect - This command is obsolete and has been removed.');
	 },

	 lobbychat: function(target, room, user, connection) {
	 	if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
	 	target = toId(target);
	 	if (target === 'off') {
	 		user.leaveRoom(Rooms.lobby, connection.socket);
	 		connection.send('|users|');
	 		this.sendReply('You are now blocking lobby chat.');
	 	} else {
	 		user.joinRoom(Rooms.lobby, connection);
	 		this.sendReply('You are now receiving lobby chat.');
	 	}
	 },

	 a: function(target, room, user) {
	 	if (!this.can('battlemessage')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	 commands: 'help',
	 h: 'help',
	 '?': 'help',
	 help: function(target, room, user) {
	 	target = target.toLowerCase();
	 	var matched = false;
	 	if (target === 'all' || target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
	 		matched = true;
	 		this.sendReply('/msg OR /whisper OR /w [username], [message] - Send a private message.');
	 	}
	 	if (target === 'all' || target === 'r' || target === 'reply') {
	 		matched = true;
	 		this.sendReply('/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.');
	 	}
	 	if (target === 'all' || target === 'getip' || target === 'ip') {
	 		matched = true;
	 		this.sendReply('/ip - Get your own IP address.');
	 		this.sendReply('/ip [username] - Get a user\'s IP address. Requires: @ & ~');
	 	}
	 	if (target === 'all' || target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
	 		matched = true;
	 		this.sendReply('/rating - Get your own rating.');
	 		this.sendReply('/rating [username] - Get user\'s rating.');
	 	}
	 	if (target === 'all' || target === 'nick') {
	 		matched = true;
	 		this.sendReply('/nick [new username] - Change your username.');
	 	}
	 	if (target === 'all' || target === 'avatar') {
	 		matched = true;
	 		this.sendReply('/avatar [new avatar number] - Change your trainer sprite.');
	 	}
	 	if (target === 'all' || target === 'rooms') {
	 		matched = true;
	 		this.sendReply('/rooms [username] - Show what rooms a user is in.');
	 	}
	 	if (target === 'all' || target === 'whois') {
	 		matched = true;
	 		this.sendReply('/whois [username] - Get details on a username: group, and rooms.');
	 	}
	 	if (target === 'all' || target === 'data') {
	 		matched = true;
	 		this.sendReply('/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability.');
	 		this.sendReply('!data [pokemon/item/move/ability] - Show everyone these details. Requires: + % @ & ~');
	 	}
	 	if (target === "all" || target === 'analysis') {
	 		matched = true;
	 		this.sendReply('/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.');
	 		this.sendReply('!analysis [pokemon], [generation] - Shows everyone this link. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'groups') {
	 		matched = true;
	 		this.sendReply('/groups - Explains what the + % @ & next to people\'s names mean.');
	 		this.sendReply('!groups - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'opensource') {
	 		matched = true;
	 		this.sendReply('/opensource - Links to PS\'s source code repository.');
	 		this.sendReply('!opensource - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'avatars') {
	 		matched = true;
	 		this.sendReply('/avatars - Explains how to change avatars.');
	 		this.sendReply('!avatars - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'intro') {
	 		matched = true;
	 		this.sendReply('/intro - Provides an introduction to competitive pokemon.');
	 		this.sendReply('!intro - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'cap') {
	 		matched = true;
	 		this.sendReply('/cap - Provides an introduction to the Create-A-Pokemon project.');
	 		this.sendReply('!cap - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'om') {
	 		matched = true;
	 		this.sendReply('/om - Provides links to information on the Other Metagames.');
	 		this.sendReply('!om - Show everyone that information. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'learn' || target === 'learnset' || target === 'learnall') {
	 		matched = true;
	 		this.sendReply('/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.')
	 		this.sendReply('!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: + % @ & ~')
	 	}
	 	if (target === 'all' || target === 'calc' || target === 'caclulator') {
	 		matched = true;
	 		this.sendReply('/calc - Provides a link to a damage calculator');
	 		this.sendReply('!calc - Shows everyone a link to a damage calculator. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'blockchallenges' || target === 'idle') {
	 		matched = true;
	 		this.sendReply('/blockchallenges - Blocks challenges so no one can challenge you. Deactivate it with /allowchallenges.');
	 	}
	 	if (target === 'all' || target === 'allowchallenges') {
	 		matched = true;
	 		this.sendReply('/allowchallenges - Unlocks challenges so you can be challenged again. Deactivate it with /blockchallenges.');
	 	}
	 	if (target === 'all' || target === 'away') {
	 		matched = true;
	 		this.sendReply('/away - Set yourself as away which will also change your name.');
	 	}
	 	if (target === 'all' || target === 'back') {
	 		matched = true;
	 		this.sendReply('/back - Marks yourself as back and reverts name back.');
	 	}
	 	if (target === 'all' || target === 'faq') {
	 		matched = true;
	 		this.sendReply('/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.');
	 		this.sendReply('!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: + % @ & ~');
	 	}
	 	if (target === 'all' || target === 'highlight') {
	 		matched = true;
	 		this.sendReply('Set up highlights:');
	 		this.sendReply('/highlight add, word - add a new word to the highlight list.');
	 		this.sendReply('/highlight list - list all words that currently highlight you.');
	 		this.sendReply('/highlight delete, word - delete a word from the highlight list.');
	 		this.sendReply('/highlight delete - clear the highlight list');
	 	}
	 	if (target === 'all' || target === 'timestamps') {
	 		matched = true;
	 		this.sendReply('Set your timestamps preference:');
	 		this.sendReply('/timestamps [all|lobby|pms], [minutes|seconds|off]');
	 		this.sendReply('all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences');
	 		this.sendReply('off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]');
	 	}
	 	if (target === 'all' || target === 'effectiveness') {
	 		matched = true;
	 		this.sendReply('/effectiveness [type1], [type2] - Provides the effectiveness of a [type1] attack to a [type2] Pokémon.');
	 		this.sendReply('!effectiveness [type1], [type2] - Shows everyone the effectiveness of a [type1] attack to a [type2] Pokémon.');
	 	}
	 	if (target === 'all' || target === 'dexsearch') {
	 		matched = true;
	 		this.sendReply('/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.');
	 		this.sendReply('Search categories are: type, tier, color, moves, ability, gen.');
	 		this.sendReply('Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.');
	 		this.sendReply('Valid tiers are: Uber/OU/BL/UU/BL2/RU/NU/NFE/LC/CAP.');
	 		this.sendReply('Types must be followed by " type", e.g., "dragon type".');
	 		this.sendReply('The order of the parameters does not matter.');
	 	}
	 	if (target === 'all' || target === 'dice' || target === 'roll') {
	 		matched = true;
	 		this.sendReply('/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.');
	 		this.sendReply('/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.');
	 	}
	 	if (target === 'all' || target === 'join') {
	 		matched = true;
	 		this.sendReply('/join [roomname] - Attempts to join the room [roomname].');
	 	}
	 	if (target === 'all' || target === 'ignore') {
	 		matched = true;
	 		this.sendReply('/ignore [user] - Ignores all messages from the user [user].');
	 		this.sendReply('Note that staff messages cannot be ignored.');
	 	}
	 	if (target === '%' || target === 'invite') {
	 		matched = true;
	 		this.sendReply('/invite [username], [roomname] - Invites the player [username] to join the room [roomname].');
	 	}
	 	if (target === '%' || target === 'roomban') {
	 		matched = true;
	 		this.sendReply('/roomban [username] - Bans the user from the room you are in. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'roomunban') {
	 		matched = true;
	 		this.sendReply('/roomunban [username] - Unbans the user from the room you are in. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'redirect' || target === 'redir') {
	 		matched = true;
	 		this.sendReply('/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'modnote') {
	 		matched = true;
	 		this.sendReply('/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'altcheck' || target === 'alt' || target === 'alts' || target === 'getalts') {
	 		matched = true;
	 		this.sendReply('/alts OR /altcheck OR /alt OR /getalts [username] - Get a user\'s alts. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'forcerename' || target === 'fr') {
	 		matched = true;
	 		this.sendReply('/forcerename OR /fr [username], [reason] - Forcibly change a user\'s name and shows them the [reason]. Requires: % @ & ~');
	 	}
	 	if (target === '@' || target === 'ban' || target === 'b') {
	 		matched = true;
	 		this.sendReply('/ban OR /b [username], [reason] - Kick user from all rooms and ban user\'s IP address with reason. Requires: @ & ~');
	 	}
	 	if (target === '&' || target === 'banip') {
	 		matched = true;
	 		this.sendReply('/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~');
	 	}
	 	if (target === '@' || target === 'unban') {
	 		matched = true;
	 		this.sendReply('/unban [username] - Unban a user. Requires: @ & ~');
	 	}
	 	if (target === '@' || target === 'unbanall') {
	 		matched = true;
	 		this.sendReply('/unbanall - Unban all IP addresses. Requires: @ & ~');
	 	}
	 	if (target === '%' || target === 'modlog') {
	 		matched = true;
	 		this.sendReply('/modlog [n] - If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for "n". Requires: % @ & ~');
	 	}
	 	if (target === "%" || target === 'kickbattle ') {
	 		matched = true;
	 		this.sendReply('/kickbattle [username], [reason] - Kicks an user from a battle with reason. Requires: % @ & ~');
	 	}
	 	if (target === "%" || target === 'warn' || target === 'k') {
	 		matched = true;
	 		this.sendReply('/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'mute' || target === 'm') {
	 		matched = true;
	 		this.sendReply('/mute OR /m [username], [reason] - Mute user with reason for 7 minutes. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'hourmute' || target === 'hm') {
	 		matched = true;
	 		this.sendReply('/hourmute OR /hm [username], [reason] - Mute user with reason for an hour. Requires: % @ & ~');
	 	}
	 	if (target === '%' || target === 'unmute') {
	 		matched = true;
	 		this.sendReply('/unmute [username] - Remove mute from user. Requires: % @ & ~');
	 	}
	 	if (target === '&' || target === 'promote') {
	 		matched = true;
	 		this.sendReply('/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: & ~');
	 	}
	 	if (target === '&' || target === 'demote') {
	 		matched = true;
	 		this.sendReply('/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: & ~');
	 	}
	 	if (target === '~' || target === 'forcerenameto' || target === 'frt') {
	 		matched = true;
	 		this.sendReply('/forcerenameto OR /frt [username] - Force a user to choose a new name. Requires: & ~');
	 		this.sendReply('/forcerenameto OR /frt [username], [new name] - Forcibly change a user\'s name to [new name]. Requires: & ~');
	 	}
	 	if (target === '&' || target === 'forcetie') {
	 		matched = true;
	 		this.sendReply('/forcetie - Forces the current match to tie. Requires: & ~');
	 	}
	 	if (target === '&' || target === 'declare') {
	 		matched = true;
	 		this.sendReply('/declare [message] - Anonymously announces a message. Requires: & ~');
	 	}
	 	if (target === '~' || target === 'chatdeclare' || target === 'cdeclare') {
	 		matched = true;
	 		this.sendReply('/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~');
	 	}
	 	if (target === '~' || target === 'globaldeclare' || target === 'gdeclare') {
	 		matched = true;
	 		this.sendReply('/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~');
	 	}
	 	if (target === '%' || target === 'announce' || target === 'wall') {
	 		matched = true;
	 		this.sendReply('/announce OR /wall [message] - Makes an announcement. Requires: % @ & ~');
	 	}
	 	if (target === '@' || target === 'modchat') {
	 		matched = true;
	 		this.sendReply('/modchat [off/autoconfirmed/+/%/@/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, & ~ for all the options');
	 	}
	 	if (target === '~' || target === 'hotpatch') {
	 		matched = true;
	 		this.sendReply('Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~');
	 		this.sendReply('Hot-patching has greater memory requirements than restarting.');
	 		this.sendReply('/hotpatch chat - reload chat-commands.js');
	 		this.sendReply('/hotpatch battles - spawn new simulator processes');
	 		this.sendReply('/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes');
	 	}
	 	if (target === '~' || target === 'lockdown') {
	 		matched = true;
	 		this.sendReply('/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~');
	 	}
	 	if (target === '~' || target === 'kill') {
	 		matched = true;
	 		this.sendReply('/kill - kills the server. Can\'t be done unless the server is in lockdown state. Requires: ~');
	 	}
	 	if (target === '~' || target === 'loadbanlist') {
	 		matched = true;
	 		this.sendReply('/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~');
	 	}
	 	if (target === '~' || target === 'makechatroom') {
	 		matched = true;
	 		this.sendReply('/makechatroom [roomname] - Creates a new room named [roomname]. Requires: ~');
	 	}
	 	if (target === '~' || target === 'deregisterchatroom') {
	 		matched = true;
	 		this.sendReply('/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: ~');
	 	}
	 	if (target === '~' || target === 'roomowner') {
	 		matched = true;
	 		this.sendReply('/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: ~');
	 	}
	 	if (target === '~' || target === 'roomdeowner') {
	 		matched = true;
	 		this.sendReply('/roomdeowner [username] - Removes [username]\'s status as a room owner. Requires: ~');
	 	}
	 	if (target === '~' || target === 'privateroom') {
	 		matched = true;
	 		this.sendReply('/privateroom [on/off] - Makes or unmakes a room private. Requires: ~');
	 	}
	 	if (target === 'all' || target === 'help' || target === 'h' || target === '?' || target === 'commands') {
	 		matched = true;
	 		this.sendReply('/help OR /h OR /? - Gives you help.');
	 	}
	 	if (!target) {
	 		this.sendReply('COMMANDS: /msg, /reply, /ignore, /ip, /rating, /nick, /avatar, /rooms, /whois, /help, /away, /back, /timestamps, /highlight');
	 		this.sendReply('INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. (Requires: + % @ & ~))');
	 		this.sendReply('For details on all room commands, use /roomhelp');
	 		this.sendReply('For details on all commands, use /help all');
	 		if (user.group !== config.groupsranking[0]) {
	 			this.sendReply('DRIVER COMMANDS: /mute, /unmute, /announce, /modlog, /forcerename, /alts')
	 			this.sendReply('MODERATOR COMMANDS: /ban, /unban, /unbanall, /ip, /redirect, /kick');
	 			this.sendReply('LEADER COMMANDS: /promote, /demote, /forcewin, /forcetie, /declare');
	 			this.sendReply('For details on all moderator commands, use /help @');
	 		}
	 		this.sendReply('For details of a specific command, use something like: /help data');
	 	} else if (!matched) {
	 		this.sendReply('The command "/'+target+'" was not found. Try /help for general help');
	 	}
	 },
           //TRAINER CARDS - Brittle, please try and keep them neat :) hi cosy
	ruby: 'Kari Ruby',
	ruby: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Elite Four:<center><img src="http://i.imgur.com/b8BkoNg.jpg"></center><br \>' +
			'Title:<center> The Gentle Blaze</center><br \>' +
			'Ace:<center> Charizard</center><br \>' +
			'Quote:<center> Now sit back and watch me burn!</center><br \>' +
			'<center><img src="http://fc07.deviantart.net/fs71/f/2013/277/a/b/mega_charizard_y_sprite_by_flamejow-d6m3y7l.png"></center>')
	},

	lily: 'Lily',
	lily: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Elite Four: Lily Rainbow<br \>' +
			'Ace: Nidoqueen<br \>' +
			'Quote: You better find a cure or I will take over! .<br \>' +
			'<img src="http://media.pldh.net/pokemon/gen5/blackwhite_animated_front/031.gif">')
	},

	xathoz: 'xathoz',
	xathoz: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Frontier: Xathoz<br \>' +
			'Ace: Gliscor<br \>' +
			'Quote: "Pride is not the opposite of shame, but its source. The only antidote to shame is true humility." -Iroh .<br \>' +
			'<img src="http://static2.wikia.nocookie.net/__cb20110817211941/pokemon/images/7/7f/Gliscor.gif">')
	},

	red: 'red',
	red: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Palace Mavin: Red<br \>' +
			'Ace: Darmanitan and Duskinoir<br \>' +
			'Quote: Either I just rek you or we screw eachother passionatly and yaoi style .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/darmanitan-standard-mode.gif">')
	},        

	blair: 'Blair',
	blair: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Leader: Blair<br \>' +
			'Ace: Togekiss<br \>' +
			'Quote: Let me just Blair some music .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/togekiss.gif">')
	},

	atom: 'Atomsk',
	atom: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Elite Four: Atomsk<br \>' +
			'Ace: Greninja<br \>' +
			'Quote: Its no fun unless your fighting a losing battle .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/x-y/pixel/greninja.png">')
	},        

	fluffy: 'Fluffy',
	fluffy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Dome Ace: Fluffy<br \>' +
			'Ace: Aegislash<br \>' +
			'Quote: Learning comes from losing .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/x-y/normal/aegislash-blade.png">')
	},        

	lynn: 'Lynn',
	lyzz: 'Lynn',
	lynn: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Champion Lyn Keikai Hikaru<br \>' +
			'Title: The Eternally Cool yet Elegant<br \>' +
			'Ace: Gardevoir and Gallade<br \>' +
			'Quote: Mind, Skill, Tranquility .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/gardevoir.gif"><img src="http://img.pokemondb.net/sprites/black-white/anim/normal/gallade.gif">')
	},

	cosy: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReply('|raw|<center><img src="http://i.imgur.com/yMNJ2xK.png"></center>');
	},

	missing1: 'missing1',
	missing1: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Leader: Missing1<br \>' +
			'Ace: Arcanine<br \>' +
			'Quote: None as of yet.<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/arcanine.gif">')
	},

	aaron: 'Aaron',
	aaron: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Leader: Aaron<br \>' +
			'Ace: Mega Aggron<br \>' +
			'Quote: Rock Solid Through The Core.<br \>' +
			'<img src="http://i305.photobucket.com/albums/nn232/XandZero2/MEGAGGRON_zpsa46c3722.png">')
	},

	raven: 'Raven',
	raven: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Gym Leader: Raven<br \>' +
			'Ace: Toxicroak <br \>' +
			'Quote: Its never truly over until one loses.<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/toxicroak.gif">')
	},

	kolotos: 'kolotos',
	kolotos: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Elite Four: Kolotos<br \>' +
			'Ace: Electivire<br \>' +
			'Quote: Feel the thunder! .<br \>' +
			'<img src="http://img.pokemondb.net/sprites/black-white/anim/normal/electivire.gif">')
	},
};
