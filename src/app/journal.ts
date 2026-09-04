import { Journal } from '../ui/Journal';
import type { Menu } from '../ui/Menu';
import type { Notices } from '../ui/Notices';
import { questById } from '../world/people';
import { worldState } from '../world/state';

/** The journal as a tab of the menu, and a line when something is written in it. */
export function installJournal(menu: Menu, notices: Notices): Journal {
  const journal = new Journal(menu, worldState);
  worldState.onStage = (quest, at) => {
    const stage = questById(quest)?.stages?.find((one) => one.at === at);
    if (stage?.log) notices.say('Journal updated', 'quest');
  };
  return journal;
}
