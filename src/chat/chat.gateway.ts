import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  
  private logger = new Logger('ChatGateway');
  
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('client 접속');
  }
  
  handleDisconnect(client: any) {
    this.logger.log('client 접속 해제');
  }

  @SubscribeMessage('join')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    this.logger.log(`Join Room: ${room}`);
    // 방 입장
    client.join(room);
    client.broadcast.to(room).emit('chat', `join: ${room}에 입장`);
  }
  
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: {room: string, msg: string}): string {
    const {room, msg} = payload;
    this.logger.log(`Message received: room: ${room} - msg: ${msg}`);
    // 웹소켓에 연결되어있는 모든 사람에게 전송
    this.server.emit('chat', `emmit: ${msg}`);
    
    // room에 있는 모든 사람에게 전송
    this.server.to(room).emit('chat', `to: ${msg}`);
    
    // 본인에게는 메시지를 보내지 않음
    client.broadcast.to(room).emit('chat', `boradecast: ${msg}`);
    return 'success';
  }
}
