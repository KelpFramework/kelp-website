@EventHandler
public void handleInteract(PlayerInteractEvent event) {
    KelpPlayer player = KelpPlayer.from(event.getPlayer());

    AnimatedInventory inventory = AnimatedInventory.create()
        .rows(6)
        .title(textAnimationFactory.newBuildingTextAnimation()
            .text("§aFOOD SELECTION")
            .ignoreSpaces()
        );

    inventory.addWidget(widgetFactory.newToggleableWidget()
        .player(player)
        .slot(42)
        .condition(() -> player.getBukkitPlayer().getGameMode() == GameMode.CREATIVE)
        .whenFalse(kelpItemFactory.newKelpItem()
            .material(KelpMaterial.RED_WOOL)
            .displayName("§cIn Survival Mode")
            .cancelInteractions()
            .addGlobalListener(event -> {
                player.sendMessage("Your Gamemode has been updated");
                player.getBukkitPlayer().setGameMode(GameMode.CREATIVE);
            })
        )

        .whenTrue(kelpItemFactory.newKelpItem()
            .material(KelpMaterial.GREEN_WOOL)
            .displayName("§cIn creative mode")
            .cancelInteractions(),
            .addGlobalListener(event -> {
                player.sendMessage("Your Gamemode has been updated");
                player.getBukkitPlayer().setGameMode(GameMode.SURVIVAL);
            })
        );

    inventory.addWidget(widgetFactory.newPagination()
        .player(player)
        .contentSlots(3, 1, 2, 12, 10, 11)
        .contentItems(
            kelpItemFactory.newKelpItem().displayName("§6Cooked Beef").material(KelpMaterial.COOKED_BEEF),
            kelpItemFactory.newKelpItem().displayName("§fCooked Chicken").material(KelpMaterial.COOKED_CHICKEN),
            kelpItemFactory.newKelpItem().displayName("§cCooked Fish").material(KelpMaterial.COOKED_SALMON),
            kelpItemFactory.newKelpItem().displayName("§fCooked Mutton").material(KelpMaterial.COOKED_MUTTON),
            kelpItemFactory.newKelpItem().displayName("§6Golden Apple").material(KelpMaterial.GOLDEN_APPLE),
            kelpItemFactory.newKelpItem().displayName("§cApple").material(KelpMaterial.APPLE),
            kelpItemFactory.newKelpItem().displayName("§6Soup").material(KelpMaterial.MUSHROOM_STEW)
        )
        .nextButton(kelpItemFactory.newKelpItem()
            .slot(21)
            .displayName("§eNext Page")
            .material(KelpMaterial.ARROW)
            .cancelInteractions()
            .addGlobalListener(event -> player.sendMessage("§cYou are already on last page"))
        )
        .previousButton(kelpItemFactory.newKelpItem()
            .slot(19)
            .displayName("§eVorherige Seite")
            .material(KelpMaterial.ARROW)
            .cancelInteractions()
            .addGlobalListener(event -> player.sendMessage("§cYou are already on first page"))
        );

    player.openInventory(inventory);
}