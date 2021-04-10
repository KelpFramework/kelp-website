@EventHandler
public void handlePlayerJoin(PlayerJoinEvent event) {
    KelpPlayer player = KelpPlayer.from(event.getPlayer());

    KelpNpc kelpNpc = npcFactory.newKelpNpc()
            .location(player.getLocation())
            .itemInHand(
                    kelpItemFactory.newKelpItem().material(KelpMaterial.APPLE)
            )
            .titleLines(()-> Lists.newArrayList("line1", "line2"))
            .skinTexture("[base64]")
            .skinSignature("[signature]");

    kelpNpc.player(player);
}