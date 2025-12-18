/**
 * Valhalla Goja scripting globals
 */

// In Goja, all numbers are JS `number` (double).

declare global {
  /**
   * NPC dialog/controller API.
   * Provided by the server when running `scripts/npc/*.js`.
   */
  const npc: ValhallaNpc;

  /**
   * Player/controller API.
   * Provided by the server when running `scripts/npc/*.js`.
   */
  const plr: ValhallaPlayer;
}

export interface ValhallaNpc {
  // Identity
  id(): number;

  // Basic dialogs
  send(text: string): number;
  sendBackNext(text: string, back: boolean, next: boolean): void;
  sendOk(text: string): void;
  sendYesNo(text: string): boolean;

  // Inputs
  sendInputText(text: string, defaultInput: string, minLength: number, maxLength: number): void;
  sendInputNumber(text: string, defaultInput: number, min: number, max: number): void;
  sendNumber(text: string, def: number, min: number, max: number): number;
  sendBoxText(text: string, defaultAnswer: string, column: number, line: number): string;
  sendQuiz(text: string, problem: string, hint: string, inputMin: number, inputMax: number, _unused: number): string;

  // Selection
  sendSelection(text: string): void;
  sendMenu(baseText: string, ...selections: string[]): number;
  sendSlideMenu(text: string): number;

  // Style windows
  sendStyles(text: string, styles: number[]): void;
  sendAvatar(text: string, ...avatars: number[]): void;

  // Other UI
  sendImage(imagePath: string): void;
  sendShop(goods: number[][]): void;
  sendStorage(npcId: number): void;
  sendGuildCreation(): void;
  sendGuildEmblemEditor(): void;

  // Reading user responses
  selection(): number;
  inputString(): string;
  inputNumber(): number;
}

export interface ValhallaQuestView {
  data: string;
  /** 0 = not started, 1 = in progress, 2 = completed */
  status: number;
}

export interface ValhallaPosition {
  x: number;
  y: number;
}

export interface ValhallaPlayer {
  // Map / instance
  warp(mapId: number): void;
  previousMap(): number;
  mapID(): number;
  position(): ValhallaPosition;
  instanceProperties(): Record<string, any>;
  playerCount(mapId: number): number;
  eventActive(mapId: number): boolean;

  // Messaging
  sendMessage(text: string): void;

  // Currency
  mesos(): number;
  giveMesos(amount: number): void;
  takeMesos(amount: number): void;
  getNX(): number;
  setNX(nx: number): void;
  getMaplePoints(): number;
  setMaplePoints(points: number): void;

  // Inventory
  giveItem(itemId: number, amount: number): boolean;
  itemCount(itemId: number): number;
  takeItem(itemId: number, slot: number, amount: number, invId: number): boolean;
  removeItemsByID(itemId: number, count: number): boolean;
  inventoryExchange(itemSource: number, srcCount: number, itemExchangeFor: number, count: number): boolean;

  // Stats
  level(): number;
  getLevel(): number;
  job(): number;
  setJob(jobId: number): void;
  gender(): number;
  setFame(value: number): void;
  giveFame(delta: number): void;
  giveAP(amount: number): void;
  giveSP(amount: number): void;
  giveEXP(amount: number): void;
  giveHP(amount: number): void;
  giveMP(amount: number): void;
  healToFull(): void;

  // Appearance
  hair(): number;
  setHair(hairId: number): void;
  face(): number;
  setFace(faceId: number): void;
  skin(): number;
  setSkinColor(skin: number): void;

  // Quests
  getQuestStatus(questId: number): number;
  checkQuestStatus(questId: number, status: number): boolean;
  questData(questId: number): string;
  checkQuestData(questId: number, data: string): boolean;
  setQuestData(questId: number, data: string): void;
  startQuest(questId: number): boolean;
  completeQuest(questId: number): boolean;
  forfeitQuest(questId: number): void;
  quest(questId: number): ValhallaQuestView;

  // Party / guild
  inParty(): boolean;
  isPartyLeader(): boolean;
  partyMembersOnMapCount(): number;
  inGuild(): boolean;
  guildRank(): number;
  disbandGuild(): void;
}

export {};



