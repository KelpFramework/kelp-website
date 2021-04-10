@EventHandler
public void handleIncomingReport(PlayerInteractEvent event) {
    KelpPlayer player = playerRepository.getKelpPlayer(event.getPlayer());
    String reportTarget = "§axX_ItzHackerPvP_Xx";
    player.sendMessage("§8[§2Kelp§8] §7A new report has been created!");
    player.sendMessage("§8[§2Kelp§8] §7Reason: §aHacking");
    player.sendMessage("§8[§2Kelp§8] §7Accused: §axX_ItzHackerPvP_Xx");
    player.sendMessage("§8[§2Kelp§8] §7Please select an action§8:");

    player.sendInteractiveMessage(InteractiveMessage.create()
        .addComponent(MessageComponent.create()
            .text("§8[§2Kelp§8] ")) // prefix component (not clickable/hoverable)
        .addComponent(MessageComponent.create()
            .text("§3§l● WATCH PLAYER  ")
            .showMessageOnHover("§aTeleport yourself to the player to validate the report")
            .executeCommandOnClick("teleport " + reportTarget))
        .addComponent(MessageComponent.create()
            .text("§c§l✖ BAN PLAYER  ")
            .showMessageOnHover("§cBan the player immediately without confirming the report")
            .suggestCommandOnClick("ban " + reportTarget + " " + "Hacking"))
            // only suggests the command to the player to that it can be modified by an admin optionally
        .addComponent(MessageComponent.create()
            .text("§b§l✚ INFO  ")
            .showMessageOnHover("§bOpens the web interface showing more information about the player")
            .openURLOnClick("https://interface.your-server.com/info/" + reportTarget))
    );
}