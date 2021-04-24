AnimatedSidebar sidebar = AnimatedSidebar.create()

    // title animation to play
  .title(BuildingTextAnimation.create()
    .text("§2§lKELP EXAMPLE SIDEBAR"))

  // interval in milliseconds between each animation state
  .titleAnimationInterval(150)

  // cluster all animations of this sidebar
  // into one scheduler with the id "example_sidebar"
  .clusterId("example_sidebar");

sidebar.addComponent(
  LineSeparatorComponent.create()
    .line(20))
  .addComponent(EmptyLineComponent.create()
    .line(19))

  // stateless text components represent text
  // that cannot be updated when a lazy-update is performed.
  .addComponent(StatelessTextComponent.create()
    .line(18)
    .text("§2§lExperience"))

  // stateless text components represent text
  // that can be updated when a lazy update is performed
  .addComponent(StatefulTextComponent.create()
    .line(17)
    .text(() -> "§8» §7" + player.getLevel()))
  .addComponent(EmptyLineComponent.create()
    .line(16))
  .addComponent(StatelessTextComponent.create()
    .line(15)
    .text("§2§lPlayers Online"))
  .addComponent(StatefulTextComponent.create()
    .line(14)
    .text(() -> "§8» §7" + Bukkit.getOnlinePlayers().size()))
  .addComponent(EmptyLineComponent.create()
    .line(13))
  .addComponent(StatelessTextComponent.create()
    .line(12)
    .text("§2§lTime"));

SimpleDateFormat dateTime = new SimpleDateFormat("HH:mm:ss dd.MM.yyyy")

sidebar.addComponent(StatefulTextComponent.create()
  .line(11)
  .text(() -> "§8» §7" + dateTime.format(new Date())))
sidebar.addComponent(EmptyLineComponent.create()
  .line(10))

// finally show the sidebar to the player
sidebar.render(player);

// you can update it later using
sidebar.update(KelpPlayer);

// or for lazy update
sidebar.lazyUpdate(KelpPlayer);