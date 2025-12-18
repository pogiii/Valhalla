# Scripting (JavaScript via Goja)

Valhalla NPC scripts are plain **JavaScript** (no Node.js) executed by the server using **[goja](https://github.com/dop251/goja)**.

The server exposes a small **Goja bridge API** to scripts. In NPC scripts (under `scripts/npc/`), the following globals are available:

- **`npc`**: NPC chat/controller (dialog windows, menus, shops, etc.)
- **`plr`**: Player/controller (warp, items, quests, stats, etc.)

## Naming convention

Valhalla configures goja with `UncapFieldNameMapper`, so **Go methods like `SendOk` are exposed to JS as `sendOk`** (lower camelCase). The definitions below use the JS names you should call from scripts.

## Execution model (important)

Most `npc.send*` methods **send a packet and then interrupt** the current script run. The server will later re-run the script when the player responds (Next/Back/Yes/No/Selection/Input).

This is why patterns like this work:

```javascript
var ok = npc.sendYesNo("Do you want to leave?");
if (ok) {
  plr.warp(100000000);
}
```

On the first run the dialog is shown (and the script is interrupted). On the next run, `sendYesNo(...)` returns the player’s previous choice.

## `npc` API

### Identity
- **`npc.id(): number`**: The NPC template ID of the NPC being talked to.

### Basic dialogs
- **`npc.send(text: string): number`**: Sends a “next” style dialog. Returns a small internal state value used by older scripts.
- **`npc.sendBackNext(text: string, back: boolean, next: boolean): void`**
- **`npc.sendOk(text: string): void`**
- **`npc.sendYesNo(text: string): boolean`**

### Input dialogs
- **`npc.sendInputText(text: string, defaultInput: string, minLength: number, maxLength: number): void`**
- **`npc.sendInputNumber(text: string, defaultInput: number, min: number, max: number): void`**
- **`npc.sendNumber(text: string, def: number, min: number, max: number): number`**
- **`npc.sendBoxText(text: string, defaultAnswer: string, column: number, line: number): string`**
- **`npc.sendQuiz(text: string, problem: string, hint: string, inputMin: number, inputMax: number, _unused: number): string`**

To read user input on a later run, use:
- **`npc.inputString(): string`**
- **`npc.inputNumber(): number`**

### Selection dialogs
- **`npc.sendSelection(text: string): void`**
- **`npc.sendMenu(baseText: string, ...selections: string[]): number`**: Builds a selection list for you (`#L0#..#l` etc.) and returns the chosen index on a later run.
- **`npc.sendSlideMenu(text: string): number`**

To read the selection on a later run, use:
- **`npc.selection(): number`**

### Style windows
- **`npc.sendStyles(text: string, styles: number[]): void`**
- **`npc.sendAvatar(text: string, ...avatars: number[]): void`**

### Other UI
- **`npc.sendImage(imagePath: string): void`**: Convenience wrapper for `#f...#` images (calls `sendOk`).
- **`npc.sendShop(goods: number[][]): void`**
- **`npc.sendStorage(npcID: number): void`**
- **`npc.sendGuildCreation(): void`**
- **`npc.sendGuildEmblemEditor(): void`**

## `plr` API

### Map / instance helpers
- **`plr.warp(mapId: number): void`**
- **`plr.previousMap(): number`**
- **`plr.mapID(): number`**
- **`plr.position(): { x: number, y: number }`**
- **`plr.instanceProperties(): Record<string, any>`**
- **`plr.playerCount(mapId: number): number`**: Player count in your current instance ID for the given map.
- **`plr.eventActive(mapId: number): boolean`**: Reads instance property `eventActive`.

### Messaging
- **`plr.sendMessage(text: string): void`**: Red-text message.

### Currency
- **`plr.mesos(): number`**
- **`plr.giveMesos(amount: number): void`**
- **`plr.takeMesos(amount: number): void`**
- **`plr.getNX(): number`**
- **`plr.setNX(nx: number): void`**
- **`plr.getMaplePoints(): number`**
- **`plr.setMaplePoints(points: number): void`**

### Inventory
- **`plr.giveItem(itemId: number, amount: number): boolean`**
- **`plr.itemCount(itemId: number): number`**
- **`plr.takeItem(itemId: number, slot: number, amount: number, invId: number): boolean`**
- **`plr.removeItemsByID(itemId: number, count: number): boolean`**
- **`plr.inventoryExchange(itemSource: number, srcCount: number, itemExchangeFor: number, count: number): boolean`**

### Character stats
- **`plr.level(): number`**
- **`plr.getLevel(): number`**: Same idea as `level()`, but always returns an `int` on the Go side.
- **`plr.job(): number`**
- **`plr.setJob(jobId: number): void`**
- **`plr.gender(): number`**
- **`plr.setFame(value: number): void`**
- **`plr.giveFame(delta: number): void`**
- **`plr.giveAP(amount: number): void`**
- **`plr.giveSP(amount: number): void`**
- **`plr.giveEXP(amount: number): void`**
- **`plr.giveHP(amount: number): void`**
- **`plr.giveMP(amount: number): void`**
- **`plr.healToFull(): void`**

### Appearance
- **`plr.hair(): number`**
- **`plr.setHair(hairId: number): void`**
- **`plr.face(): number`**
- **`plr.setFace(faceId: number): void`**
- **`plr.skin(): number`**
- **`plr.setSkinColor(skin: number): void`**

### Quests
- **`plr.getQuestStatus(questId: number): number`**: `0 = not started`, `1 = in progress`, `2 = completed`
- **`plr.checkQuestStatus(questId: number, status: number): boolean`**
- **`plr.questData(questId: number): string`**
- **`plr.checkQuestData(questId: number, data: string): boolean`**
- **`plr.setQuestData(questId: number, data: string): void`**
- **`plr.startQuest(questId: number): boolean`**
- **`plr.completeQuest(questId: number): boolean`**
- **`plr.forfeitQuest(questId: number): void`**
- **`plr.quest(questId: number): { data: string, status: number }`**

### Party / guild
- **`plr.inParty(): boolean`**
- **`plr.isPartyLeader(): boolean`**
- **`plr.partyMembersOnMapCount(): number`**
- **`plr.inGuild(): boolean`**
- **`plr.guildRank(): number`**
- **`plr.disbandGuild(): void`**

## Editor autocomplete (no Node.js required)

This repo includes:

- `scripts/valhalla.d.ts`: global type declarations for `npc` and `plr`
- `jsconfig.json`: tells editors/TypeScript-language-service to include `scripts/**/*.js` and the `.d.ts`

Most editors will now offer autocomplete inside `scripts/**/*.js` automatically.



