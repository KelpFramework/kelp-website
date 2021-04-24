KelpPlayer player = KelpPlayer.from(event.getPlayer());

final int SIZE = 27;
player.openInventory(SimpleInventory.create()
  .title(() -> "§6Food Menu")
  .size(SIZE)
  .addWidget(PlaceholderWidget.create()
    .addSlots(SlotArea.outerBorder(SIZE)))
  .addWidget(Pagination.create()
    .contentSlots(SlotArea.rectangle(10, 16))
    .contentWidgets(() -> Lists.newArrayList(
      StatelessItemWidget.create()
        .item(KelpItem.create()
          .material(KelpMaterial.APPLE)
          .displayName("§cApple")
          .addGlobalListener(clickEvent ->
            player.getInventory().addItem(KelpItem.create().material(KelpMaterial.APPLE)))),
      StatelessItemWidget.create()
        .item(KelpItem.create()
          .material(KelpMaterial.MUSHROOM_STEW)
          .displayName("§6Soup")
          .addGlobalListener(clickEvent ->
            player.getInventory().addItem(KelpItem.create().material(KelpMaterial.MUSHROOM_STEW)))),

      ...

      StatelessItemWidget.create()
        .item(KelpItem.create()
          .material(KelpMaterial.POISONOUS_POTATO)
          .displayName("§aPoisonous Potato")
          .addGlobalListener(clickEvent ->
            player.getInventory().addItem(KelpItem.create().material(KelpMaterial.POISONOUS_POTATO))))
    ))
    .nextButton(KelpItem.create().material(KelpMaterial.ARROW).displayName("§cNext page").slot(26),
      () -> player.sendMessage("§cYou are already on the last page."))
    .previousButton(KelpItem.create().material(KelpMaterial.ARROW).displayName("§cPrevious page").slot(18),
      () -> player.sendMessage("§cYou are already on the first page.")))
);