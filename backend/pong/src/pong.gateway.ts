import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  GameInstruction,
  GameState,
} from './pong.interface';
import { Server } from 'socket.io';
import { setServer, addGameUser, deleteGameUser, receiveGameKeypress, sendGameState } from './pong.game';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PongGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();
  private logger = new Logger('PongGateway');

  getClientID(@ConnectedSocket() client: any)
  {
    return `${client.id}`;
  }

  handleConnection(@ConnectedSocket() client: any)
  {
    var id: string;
  
    id = this.getClientID(client);
    console.log(id);
    setServer(this.server);
    addGameUser(id, id, 'community_pong');
    client.join('community_pong');
    sendGameState(this.server, 'community_pong');
  }

  handleDisconnect(@ConnectedSocket() client: any)
  {
    deleteGameUser(this.getClientID(client));
    client.leave('community_pong');
  }

  @SubscribeMessage('pong_keypress')
  async handleReceiveKeypress(@ConnectedSocket() client: any, @MessageBody() payload: GameInstruction)
    : Promise<void>
  {
    receiveGameKeypress(this.server, this.getClientID(client), payload.keypress);
    this.logger.log(payload);
  }
}
