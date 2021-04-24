KelpNpc.create()

  // the player who should see the NPC
  .player(player)

  // hide the default custom name
  .hideCustomName()

  // the initial spawn location
  .location(player.getLocation())

  // give the NPC an enchanted iron sword
  .itemInHand(KelpItem.create()
    .material(KelpMaterial.IRON_SWORD)
    .enchant(KelpEnchantment.UNBREAKING, 1)
  )

  // title lines above the NPC's head.
  .titleLines(() -> Lists.newArrayList(
    "§2KELP DEMONSTRATION",
    "§7This is a demo NPC. Create as",
    "§7many title lines as you want!"
  ))

  // automatically despawns the NPC when it is more than
  // 50 blocks away from a player and respawns it again
  // when the player comes closer again
  .addActivity(AutoSpawnActivity.create()
    .distanceThreshold(30))

  // makes the npc constantly look at the given
  // target location.
  .addActivity(LookToActivity.create()
    .target(player::getLocation))

  // imitates the sneaking behavior of the given
  // player.
  .addActivity(SneakingActivity.create()
    .imitatedPlayer(player))

  // sets the skin UUID of the player. You can
  // optionally pass skin texture and signature here.
  .uuid("e9013c2f-da01-425f-a48b-516f55e94386")

  // finally spawn it to the player.
  .spawn();